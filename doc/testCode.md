# Testovací kód
## Všechny instrukce

HALT
NEGATE
ACCDEC
ACCINC
NOP
OUTP @0000
INP @0001
MLOAD 4086
DLOAD @0002
ILOAD @0003
DSTORE @0004
ISTORE @0005
BRANCH test
BRZERO test
BRPOS test
BRNEG test
MADD @0006
IJUMP @0007

## Jednoduchý program

;This is simple test program
MLOAD 5
loop:               ; Simple loop
    DSTORE @10
    ACCDEC
    ISTORE @10
    BRPOS loop      ; Return back
    ; End of program
