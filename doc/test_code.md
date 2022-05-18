# Testovací kód
## Všechny instrukce

```asm
HALT
NEGATE
ACCDEC
ACCINC
NOP
OUTP
INP
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
:test
```

## Jednoduchý program
```asm
; Základní ukázkový program
; Naplní paměti 7-0 hodnotami jejich adres
	MLOAD 7
loop:
	DSTORE @10
	ISTORE @10
	ACCDEC
	BRPOS loop
```
