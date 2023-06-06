/*
  <[^>]*>?
  match html tags on either side of a string

  (\r\n|\n|\r)
  match new line characters

  \s\s+
  match multiple spaces or tabs

  &nbsp;
  match &nbsp;

  g
  global

  m
  multiline
*/

export const MATCH_HTML_TAGS = /<[^>]*>?/gm
export const MATCH_LINE_BREAK = /(\r\n|\n|\r)/gm
export const MATCH_MULTI_SPACE = /&nbsp;|\s\s+/gm // or &nbsp;
export const MATCH_APOS = /'|&#39;|&#x27;|&#039;/gm
export const MATCH_QUOTE = /"|&quot;/gm
export const MATCH_AMP = /"|&amp;/gm
