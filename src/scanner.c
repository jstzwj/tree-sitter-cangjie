#include "tree_sitter/alloc.h"
#include "tree_sitter/parser.h"

#include <wctype.h>

enum TokenType
{
    LINE_STR_TEXT_NO_ESCAPE,       // _line_str_text_no_escape
    MULTI_LINE_STR_TEXT_NO_ESCAPE, // _multi_line_str_text_no_escape
    MULTI_LINE_RAW_STRING_START,   // multi_line_raw_string_start
    MULTI_LINE_RAW_STRING_CONTENT, // multi_line_raw_string_content
    MULTI_LINE_RAW_STRING_END,     // multi_line_raw_string_end
    ERROR_SENTINEL,
};

typedef struct
{
    uint8_t opening_hash_count;
    int32_t opening_quotation;
} Scanner;

void *tree_sitter_cangjie_external_scanner_create() { return ts_calloc(1, sizeof(Scanner)); }

void tree_sitter_cangjie_external_scanner_destroy(void *payload) { ts_free((Scanner *)payload); }

unsigned tree_sitter_cangjie_external_scanner_serialize(void *payload, char *buffer)
{
    Scanner *scanner = (Scanner *)payload;
    buffer[0] = (char)scanner->opening_hash_count;
    return 1;
}

void tree_sitter_cangjie_external_scanner_deserialize(void *payload, const char *buffer, unsigned length)
{
    Scanner *scanner = (Scanner *)payload;
    scanner->opening_hash_count = 0;
    if (length == 1)
    {
        Scanner *scanner = (Scanner *)payload;
        scanner->opening_hash_count = buffer[0];
    }
}

static inline bool is_num_char(int32_t c) { return c == '_' || iswdigit(c); }

static inline void advance(TSLexer *lexer) { lexer->advance(lexer, false); }

static inline void skip(TSLexer *lexer) { lexer->advance(lexer, true); }

static inline bool process_line_str_text_no_escape(TSLexer *lexer)
{
    bool has_content = false;
    bool is_dollar = false;
    for (;;)
    {
        if (lexer->eof(lexer))
        {
            return false;
        }

        // /[\\\r\n"']/
        if (lexer->lookahead == '\"' ||
            lexer->lookahead == '\'' ||
            lexer->lookahead == '\r' ||
            lexer->lookahead == '\n' ||
            lexer->lookahead == '\\')
        {
            if (is_dollar)
            {
                has_content = true;
            }
            lexer->mark_end(lexer);
            break;
        }
        else if (lexer->lookahead == '$')
        {
            is_dollar = lexer->lookahead == '$';
            lexer->mark_end(lexer);
        }
        else if (lexer->lookahead == '{')
        {
            if (is_dollar)
            {
                break;
            }
            else
            {
                has_content = true;
                lexer->mark_end(lexer);
            }
        }
        else
        {
            has_content = true;
            lexer->mark_end(lexer);
        }

        advance(lexer);
    }
    lexer->result_symbol = LINE_STR_TEXT_NO_ESCAPE;
    return has_content;
}

static inline bool process_multi_line_str_text_no_escape(TSLexer *lexer)
{
    bool has_content = false;
    bool is_dollar = false;
    for (;;)
    {
        if (lexer->eof(lexer))
        {
            return false;
        }

        // /[^\\]/
        if (lexer->lookahead == '\"' ||
            lexer->lookahead == '\\')
        {
            if (is_dollar)
            {
                has_content = true;
            }
            lexer->mark_end(lexer);
            break;
        }
        else if (lexer->lookahead == '$')
        {
            is_dollar = lexer->lookahead == '$';
            lexer->mark_end(lexer);
        }
        else if (lexer->lookahead == '{')
        {
            if (is_dollar)
            {
                break;
            }
            else
            {
                has_content = true;
                lexer->mark_end(lexer);
            }
        }
        else
        {
            has_content = true;
            lexer->mark_end(lexer);
        }

        advance(lexer);
    }
    lexer->result_symbol = MULTI_LINE_STR_TEXT_NO_ESCAPE;
    return has_content;
}

static inline bool scan_multi_line_raw_string_start(Scanner *scanner, TSLexer *lexer)
{
    if (lexer->lookahead != '#')
    {
        return false;
    }
    advance(lexer);

    int32_t opening_hash_count = 1;
    uint8_t opening_quotation = '#';
    while (lexer->lookahead == '#')
    {
        advance(lexer);
        opening_hash_count++;
    }

    if (lexer->lookahead == '"' || lexer->lookahead == '\'')
    {
        opening_quotation = lexer->lookahead;
        advance(lexer);
    }
    scanner->opening_hash_count = opening_hash_count;
    scanner->opening_quotation = opening_quotation;

    lexer->result_symbol = MULTI_LINE_RAW_STRING_START;
    return true;
}

static inline bool scan_multi_line_raw_string_content(Scanner *scanner, TSLexer *lexer)
{
    for (;;)
    {
        if (lexer->eof(lexer))
        {
            return false;
        }
        if ((lexer->lookahead == '"' || lexer->lookahead == '\'' || lexer->lookahead == '#') && lexer->lookahead == scanner->opening_quotation)
        {
            if (lexer->lookahead == '"' || lexer->lookahead == '\'')
            {
                lexer->mark_end(lexer);
                advance(lexer);
            }
            else if (lexer->lookahead == '#')
            {
                lexer->mark_end(lexer);
            }

            unsigned hash_count = 0;
            while (lexer->lookahead == '#' && hash_count < scanner->opening_hash_count)
            {
                advance(lexer);
                hash_count++;
            }
            if (hash_count == scanner->opening_hash_count)
            {
                lexer->result_symbol = MULTI_LINE_RAW_STRING_CONTENT;
                return true;
            }
        }
        else
        {
            advance(lexer);
        }
    }
}

static inline bool scan_multi_line_raw_string_end(Scanner *scanner, TSLexer *lexer)
{
    if (lexer->lookahead == '"' || lexer->lookahead == '\'')
    {
        if (lexer->lookahead == scanner->opening_quotation)
        {
            advance(lexer);
        }
        else
        {
            return false;
        }
    }

    for (unsigned i = 0; i < scanner->opening_hash_count; i++)
    {
        advance(lexer);
    }
    lexer->result_symbol = MULTI_LINE_RAW_STRING_END;
    return true;
}

bool tree_sitter_cangjie_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols)
{

    if (valid_symbols[ERROR_SENTINEL])
    {
        return false;
    }

    Scanner *scanner = (Scanner *)payload;

    if (valid_symbols[LINE_STR_TEXT_NO_ESCAPE])
    {
        return process_line_str_text_no_escape(lexer);
    }

    if (valid_symbols[MULTI_LINE_STR_TEXT_NO_ESCAPE])
    {
        return process_multi_line_str_text_no_escape(lexer);
    }

    while (iswspace(lexer->lookahead))
    {
        skip(lexer);
    }

    if (valid_symbols[MULTI_LINE_RAW_STRING_START] &&
        (lexer->lookahead == '#'))
    {
        return scan_multi_line_raw_string_start(scanner, lexer);
    }

    if (valid_symbols[MULTI_LINE_RAW_STRING_CONTENT])
    {
        return scan_multi_line_raw_string_content(scanner, lexer);
    }

    if (valid_symbols[MULTI_LINE_RAW_STRING_END] && (lexer->lookahead == '#' || lexer->lookahead == '"' || lexer->lookahead == '\''))
    {
        return scan_multi_line_raw_string_end(scanner, lexer);
    }

    return false;
}