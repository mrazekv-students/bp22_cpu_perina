// Custom bp22 assembly language highlighting

export let bp22Highlight = {
    'operator': /\b(?:HALT|NEGATE|ACCDEC|ACCINC|NOP|OUTP|INP|MLOAD|DLOAD|ILOAD|DSTORE|ISTORE|BRANCH|BRZERO|BRPOS|BRNEG|MADD|IJUMP|LABEL|FLUSH)\b/i,
    'comment': /;.*/,
    'string': /@[0-9a-f]+\b/i
};
