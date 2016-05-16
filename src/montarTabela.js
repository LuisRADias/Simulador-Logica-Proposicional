/*
    Monta a tabela verdade.
*/
function gerarTabela (formula)
{
    var table = [];
    var simbProp = "";
    var bin = "";
    var temp;
    
    simbProp = procura_Simb_Prop(formula);    
//    table = "<table class='resultado'>";
   
    aux = Math.pow(2, simbProp.length);
    for (var i=0; i<aux; i++)
    {
        bin = gerarBinario(i, simbProp.length);
        temp = calcularFunc(formula, simbProp, bin);
        table.push( new Array(bin, temp) );
    }
    
    return table;
}





/*
    Monta as linhas da tabela dados os valores verdade para o símbolos proposicionais e o função calculada com os mesmos
*/
function construirLinha (bin, resultado)
{
    table += "<tr>";
    for (var i=0; i<bin.length; i++)
        table += "<td>" + bin.charAt(i) + "</td>";
        
    table += "<td>" + resultado + "</td></tr>";
}





/*
    Retorno: (string) Forma binária de i
*/
function gerarBinario (n, tam)
{
    var retorno = "";
    var aux = "";
    
    while (n>1)
    {
        aux = "" + Math.floor(n%2);
        n = Math.floor(n/2);
        retorno = aux.concat(retorno);
    }
    aux = "" + n;
    retorno = aux.concat(retorno);

    for (var i=retorno.length; i<tam; i++)
    {
        retorno = '0' + retorno;
    }
    
    return retorno;
}





/*
    Argumentos: formula  - formula a ser clculada
                simbProp - símbolos proposicionais existentes
                bin      - valores verdade dos simbolos proposicionais
    Retorno: (string) resultado da funcão
*/
function calcularFunc(formula, simbProp, binProp)
{
    var aux, temp, i, subFormula;
    var op1, op2;
    
    
    // Tratar parenteses
    aux = formula.indexOf('(');
    while (aux != -1)
    {
        temp = 0
        for (i=aux+1; i<formula.length; i++)
        {
            if (formula.charAt(i) == '(')
                temp++;
            if (formula.charAt(i) == ')')
                temp--;
             
            if (temp < 0)
                break;
        }
        
        temp = formula.slice(aux, i+1);
        subFormula = formula.slice(aux+1, i);
        formula = formula.replace(temp, calcularFunc(subFormula, simbProp, binProp));
        
        aux = formula.indexOf('(');
    }
    
    
    
    // Tratar simbolos proposicionais
    for (i=0; i<simbProp.length; i++)
    {
        while (formula.indexOf(simbProp.charAt(i)) != -1)
            formula = formula.replace(simbProp.charAt(i), binProp.charAt(i));
    }


    
    // Tratar negações
    aux = formula.indexOf(NAO);
    while (aux != -1)
    {
        temp = 1;
        while (formula.charAt(aux+temp) == NAO)
        {
            temp++;
        }

        if (formula.charAt(aux+temp) == '0')
        {
            subFormula = formula.slice(0);
            formula = subFormula.slice(0, aux) + '1' + subFormula.slice(aux+temp+1);
        }
        else
        {
            subFormula = formula.slice(0);
            formula = subFormula.slice(0, aux) + '0' + subFormula.slice(aux+temp+1);
        }

        aux = formula.indexOf(NAO);
    }

    // Tratar E e OU
    op1 = formula.indexOf(E);
    op2 = formula.indexOf(OU);
    if (op1 == -1) {
        aux = op2; }
    else if (op2 == -1) {
        aux = op1;      }
    else {
        aux = (op1 < op2) ? op1 : op2; }
    while (aux != -1)
    {
        if (formula.charAt(aux) == E)
        {
            if (formula.charAt(aux-1) == '1' && formula.charAt(aux+1) == '1')
                i = '1';
            else
                i = '0';
        }
        else
        {
            if (formula.charAt(aux-1) == '1' || formula.charAt(aux+1) == '1')
                i = '1';
            else
                i = '0';
        }
        
        subFormula = formula.slice(0);
        formula = subFormula.slice(0, aux-1) + i + subFormula.slice(aux+2);
        
        op1 = formula.indexOf(E);
        op2 = formula.indexOf(OU);
        if (op1 == -1) {
            aux = op2; }
        else if (op2 == -1) {
            aux = op1;      }
        else {
            aux = (op1 < op2) ? op1 : op2; }
    }    
    
    // Tratar implicações e biimplicações
    op1 = formula.indexOf(IMP);
    op2 = formula.indexOf(BIMP);
    if (op1 == -1) {
        aux = op2; }
    else if (op2 == -1) {
        aux = op1;      }
    else {
        aux = (op1 < op2) ? op1 : op2; }
    while (aux != -1)
    {
        if (formula.charAt(aux) == IMP)
        {
            if (formula.charAt(aux-1) == '1' && formula.charAt(aux+1) == '0')
                i = '0';
            else
                i = '1';
        }
        else
        {
            if (formula.charAt(aux-1) == formula.charAt(aux+1))
                i = '1';
            else
                i = '0';
        }
        
        subFormula = formula.slice(0);
        formula = subFormula.slice(0, aux-1) + i + subFormula.slice(aux+2);
        
        op1 = formula.indexOf(IMP);
        op2 = formula.indexOf(BIMP);
        if (op1 == -1) {
            aux = op2; }
        else if (op2 == -1) {
            aux = op1;      }
        else {
            aux = (op1 < op2) ? op1 : op2; }
    }

    
    return formula;
}


