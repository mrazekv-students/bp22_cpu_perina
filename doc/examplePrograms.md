# Příklady programů a algoritmů způsobující problémy s pamětí
## Zdroje
- https://stackoverflow.com/questions/16699247/what-is-a-cache-friendly-code

## Průchod matice 4x4
https://www.geeksforgeeks.org/computer-organization-locality-and-cache-friendly-code/

```(asm)
; Průchod maticí 4x4
; Matice je v paměti uložena po řádcích
; Matice je procházena po sloupcích
; Při průchodu se pole matice zpracují
; Zpracované pole matici mají hodnotu 1

  ; Aktuální adresa
  MLOAD 0
  DSTORE @20
  ; Čítač sloupců
  MLOAD 4
  DSTORE @21
  ; Čítač řádků
  MLOAD 4
  DSTORE @22
  ; Základní adresa sloupce
  MLOAD -1
  DSTORE @23
col:
  ; Načte se základní adresa sloupce
  DLOAD @23
  ACCINC
  DSTORE @23
  ; Skok na end pok čítač sloupců == 0
  DLOAD @21
  BRZERO end
  ; Dekrementuje se čítač sloupců
  ACCDEC
  DSTORE @21
  ; Nastaví se čítač řádků
  MLOAD 4
  DSTORE @22
  ; Nastaví aktuální adresu
  DLOAD @23
  DSTORE @20
row:
  ; Průchod
  MLOAD 1
  ISTORE @20
  ; Upraví se adresa sloupce na další řádek
  DLOAD @20
  ACCINC ACCINC ACCINC ACCINC
  DSTORE @20
  ; Dekrementuje se čítač řádku 
  DLOAD @22
  ACCDEC
  DSTORE @22
  ; Skok na col pokud čítač řádků == 0
  BRZERO col
  ; Skok na row jinak
  BRANCH row
end:
  HALT
```

```(asm)
; Průchod maticí 4x4
; Matice je v paměti uložena po řádcích
; Matice je procházena po řádcích
; Při průchodu se pole matice zpracují
; Zpracované pole matici mají hodnotu 1

  ; Aktuální adresa
  MLOAD 0
  DSTORE @20
  ; Čítač řádků
  MLOAD 4
  DSTORE @21
  ; Čítač sloupců
  MLOAD 4
  DSTORE @22
row:
  ; Skok na end pokud čítač řádků == 0
  DLOAD @21
  BRZERO end
  ; Dekrementuje se čítač řádků
  ACCDEC
  DSTORE @21
  ; Nastaví se čítač sloupců
  MLOAD 4
  DSTORE @22
col:
  ; Průchod
  MLOAD 1
  ISTORE @20
  ; Upraví se adresa na další buňku
  DLOAD @20
  ACCINC
  DSTORE @20
  ; Dekrementuje se čítač sloupců 
  DLOAD @22
  ACCDEC
  DSTORE @22
  ; Skok na col pokud čítač sloupců == 0
  BRZERO row
  ; Skok na row jinak
  BRANCH col
end:
  HALT
```

## (Násobení) matic
http://web.cecs.pdx.edu/~jrb/cs201/lectures/cache.friendly.code.pdf (p.27)
https://www.cse.iitk.ac.in/users/swarnendu/courses/autumn2019-cs698l/Write%20Cache-Friendly%20Code.pdf (p.86)

## Dva cykly nebo jeden cyklus?
https://www.cse.iitk.ac.in/users/swarnendu/courses/autumn2019-cs698l/Write%20Cache-Friendly%20Code.pdf (p.79)

```(asm)
; Zpracování pole pomocí jednoho cyklu
; Hodnota prvku se nejdřív nastaví na 1
; poté se inkrementuje

  ; Čítač pro pohyb v poli
  MLOAD 62
  DSTORE @3F
loop:
  ; Nastavit hodnotu na 1 a uložit
  MLOAD 1
  ISTORE @3F
  ; Hodnotu inkrementovat a uložit
  ILOAD @3F
  INC
  ISTORE @3F
  ; Pokud čítač == 0 tak konec
  DLOAD @3F
  BRZERO end
  ; Jinak pokračovat
  BRANCH loop
end:
  HALT
```

```(asm)
; Zpracování pole pomocí dvou cyklů
; Hodnota prvku se nejdřív nastaví na 1
; poté se inkrementuje

  ; Čítač pro pohyb v poli
  MLOAD 62
  DSTORE @3F
loop_one:
  ; Nastavit hodnota na 1
  MLOAD 1
  ISTORE @3F
  ; Pokud čítač == 0 tak konec cyklu
  DLOAD @3F
  BRZERO end_one
  ; Jinak pokračovat
  BRANCH loop_one
end_one:
  ; Čítač pro pohyb v poli (znovu)
  MLOAD 62
  DSTORE @3F
loop_inc:
  ; Hodnotu inkrementovat
  ILOAD @3F
  INC
  ISTORE @3F
  ; Pokud čítač == 0 tak konec
  DLOAD @3f
  BRZERO end_inc
  ; Jinak pokračovat
  BRANCH loop_inc
end_inc:
  HALT
```

## Spojitý seznam
https://stackoverflow.com/questions/16699247/what-is-a-cache-friendly-code

```(asm)
; Průchod spojitým seznamem
; Prvek seznamu se skládá ze dvojice:
; hodnota a odkaz na další prvek

  ; Vytvořit seznam
  MLOAD 1 DSTORE @04 MLOAD 6 DSTORE @05
  MLOAD 1 DSTORE @06 MLOAD 8 DSTORE @07
  MLOAD 1 DSTORE @08 MLOAD 10 DSTORE @09
  MLOAD 1 DSTORE @0A MLOAD 20 DSTORE @0B
  MLOAD 1 DSTORE @14 MLOAD 26 DSTORE @15
  MLOAD 1 DSTORE @1A MLOAD 14 DSTORE @AB
  MLOAD 1 DSTORE @0E MLOAD 18 DSTORE @0F
  MLOAD 1 DSTORE @12 MLOAD -1 DSTORE @13

  ; Průchod seznamem
  ; Aktuální prvek
  MLOAD 4
  DSTORE @0
loop:
  ; Vynulovat hodnotu prvku
  MLOAD 0
  ISTORE @0
  ; Načíst odkaz na další prvek
  DLOAD @0
  ACCINC
  DSTORE @0
  ILOAD @0
  ; Pokud odkaz je záporný tak konec
  BRNEG end
  ; Jinak pokračovat
  BRANCH loop
end:
  HALT
```
