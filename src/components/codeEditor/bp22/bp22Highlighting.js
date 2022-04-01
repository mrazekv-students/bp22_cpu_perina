// Custom bp22 assembly language highlighting

export let bp22Highlight = {
    'operator': /\b(?:HALT|NEGATE|ACCDEC|ACCINC|NOP|OUTP|INP|MLOAD|DLOAD|ILOAD|DSTORE|ISTORE|BRANCH|BRZERO|BRPOS|BRNEG|MADD|IJUMP|LABEL)\b/i,
    'comment': /;.*/,
    'string': /@\d*\b/
};
