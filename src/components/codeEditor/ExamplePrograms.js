// Example programs

export let examplePrograms = [
    {
        label: 'Základní ukázkový program',
        code: '; Základní ukázkový program\n; Naplní paměti 7-0 hodnotami jejich adres\n  MLOAD 7\nloop:\n  DSTORE @10\n  ISTORE @10\n  ACCDEC\n  BRPOS loop\n'
    },
    {
        label: 'Průchod maticí po sloupcích',
        code: '; Průchod maticí 4x4\n; Matice je v paměti uložena po řádcích\n; Matice je procházena po sloupcích\n; Při průchodu se pole matice zpracují\n; Zpracované pole matici mají hodnotu 1\n\n  ; Aktuální adresa\n  MLOAD 0\n  DSTORE @20\n  ; Čítač sloupců\n  MLOAD 4\n  DSTORE @21\n  ; Čítač řádků\n  MLOAD 4\n  DSTORE @22\n  ; Základní adresa sloupce\n  MLOAD -1\n  DSTORE @23\n\n  ; Algoritmus\n  FLUSH HALT\ncol:\n  ; Načte se základní adresa sloupce\n  DLOAD @23\n  ACCINC\n  DSTORE @23\n  ; Skok na end pok čítač sloupců == 0\n  DLOAD @21\n  BRZERO end\n  ; Dekrementuje se čítač sloupců\n  ACCDEC\n  DSTORE @21\n  ; Nastaví se čítač řádků\n  MLOAD 4\n  DSTORE @22\n  ; Nastaví aktuální adresu\n  DLOAD @23\n  DSTORE @20\nrow:\n  ; Průchod\n  MLOAD 1\n  ISTORE @20\n  ; Upraví se adresa sloupce na další řádek\n  DLOAD @20\n  ACCINC ACCINC ACCINC ACCINC\n  DSTORE @20\n  ; Dekrementuje se čítač řádku\n  DLOAD @22\n  ACCDEC\n  DSTORE @22\n  ; Skok na col pokud čítač řádků == 0\nn  BRZERO col\n  ; Skok na row jinak\n  BRANCH row\nend:\n  HALT\n'
    },
    {
        label: 'Průchod maticí po řádcích',
        code: '; Průchod maticí 4x4\n; Matice je v paměti uložena po řádcích\n; Matice je procházena po řádcích\n; Při průchodu se pole matice zpracují\n; Zpracované pole matici mají hodnotu 1\n  ; Aktuální adresa\n  MLOAD 0\n  DSTORE @20\n  ; Čítač řádků\n  MLOAD 4\n  DSTORE @21\n  ; Čítač sloupců\n  MLOAD 4\n  DSTORE @22\n\n ; Algoritmus\n  FLUSH HALT\nrow:\n  ; Skok na end pokud čítač řádků == 0\n  DLOAD @21\n  BRZERO end\n  ; Dekrementuje se čítač řádků\n  ACCDEC\n  DSTORE @21\n  ; Nastaví se čítač sloupců\n  MLOAD 4\n  DSTORE @22\ncol:\n  ; Průchod\n  MLOAD 1\n  ISTORE @20\n  ; Upraví se adresa na další buňku\n  DLOAD @20\n  ACCINC\n  DSTORE @20\n  ; Dekrementuje se čítač sloupců\n  DLOAD @22\n  ACCDEC\n  DSTORE @22\n  ; Skok na col pokud čítač sloupců == 0\n  BRZERO row\n  ; Skok na row jinak\n  BRANCH col\nend:\n  HALT\n'
    },
    {
        label: 'Zpracování pole jedním cyklem',
        code: '; Zpracování pole pomocí jednoho cyklu\n; Hodnota prvku se nejdřív nastaví na 1\n; poté se inkrementuje\n\n  ; Čítač pro pohyb v poli\n  MLOAD 31\n  DSTORE @3F\n  FLUSH HALT\nloop:\n  ; Nastavit hodnotu na 1 a uložit\n  MLOAD 1\n  ISTORE @3F\n  ; Hodnotu inkrementovat a uložit\n  ILOAD @3F\n  ACCINC\n  ISTORE @3F\n  ; Pokud čítač == 0 tak konec\n  DLOAD @3F\n  BRZERO end\n  ; Jinak pokračovat\n  ACCDEC\n  DSTORE @3F\n  BRANCH loop\nend:\n  HALT\n'
    },
    {
        label: 'Zpracování pole dvěma cykly',
        code: '; Zpracování pole pomocí dvou cyklů\n; Hodnota prvku se nejdřív nastaví na 1\n; poté se inkrementuje\n\n  ; Čítač pro pohyb v poli\n  MLOAD 31\n  DSTORE @3F\n  FLUSH HALT\nloop_one:\n  ; Nastavit hodnota na 1\n  MLOAD 1\n  ISTORE @3F\n  ; Pokud čítač == 0 tak konec cyklu\n  DLOAD @3F\n  BRZERO end_one\n  ; Jinak pokračovat\n  ACCDEC\n  DSTORE @3F\n  BRANCH loop_one\nend_one:\n  ; Čítač pro pohyb v poli (znovu)\n  MLOAD 31\n  DSTORE @3F\nloop_inc:\n  ; Hodnotu inkrementovat\n  ILOAD @3F\n  ACCINC\n  ISTORE @3F\n  ; Pokud čítač == 0 tak konec\n  DLOAD @3F\n  BRZERO end_inc\n  ; Jinak pokračovat\n  ACCDEC\n  DSTORE @3F\n  BRANCH loop_inc\nend_inc:\n  HALT\n'
    },
    {
        label: 'Zpracování spojitého seznamu',
        code: '; Průchod spojitým seznamem\n; Prvek seznamu se skládá ze dvojice:\n; hodnota a odkaz na další prvek\n\n  ; Vytvořit seznam\n  MLOAD 1 DSTORE @04 MLOAD 10 DSTORE @05\n  MLOAD 1 DSTORE @0A MLOAD 16 DSTORE @0B\n  MLOAD 1 DSTORE @10 MLOAD 22 DSTORE @11\n  MLOAD 1 DSTORE @16 MLOAD 28 DSTORE @17\n  MLOAD 1 DSTORE @1C MLOAD 34 DSTORE @1D\n  MLOAD 1 DSTORE @22 MLOAD 40 DSTORE @23\n  MLOAD 1 DSTORE @28 MLOAD 44 DSTORE @29\n  MLOAD 1 DSTORE @2C MLOAD -1 DSTORE @2D\n\n  ; Průchod seznamem\n  FLUSH HALT\n  ; Aktuální prvek\n  MLOAD 4\n  DSTORE @0\nloop:\n  ; Vynulovat hodnotu prvku\n  MLOAD 0\n  ISTORE @0\n  ; Načíst odkaz na další prvek\n  DLOAD @0\n  ACCINC\n  DSTORE @0\n  ILOAD @0\n  DSTORE @0\n  ; Pokud odkaz je záporný tak konec\n  BRNEG end\n  ; Jinak pokračovat\n  BRANCH loop\nend:\n  HALT\n'
    }
]
