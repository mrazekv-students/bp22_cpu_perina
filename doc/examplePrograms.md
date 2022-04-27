# Příklady programů a algoritmů způsobující problémy s pamětí
## Zdroje
- https://stackoverflow.com/questions/58355239/which-algorithm-or-program-or-code-has-a-very-bad-usage-of-cache
- https://www.geeksforgeeks.org/computer-organization-locality-and-cache-friendly-code/
- http://web.cecs.pdx.edu/~jrb/cs201/lectures/cache.friendly.code.pdf
- https://www.cse.iitk.ac.in/users/swarnendu/courses/autumn2019-cs698l/Write%20Cache-Friendly%20Code.pdf (p.76)
- https://dropbox.tech/infrastructure/caching-in-theory-and-practice
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
