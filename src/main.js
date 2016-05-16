$(document).ready( function () 
{
    $("#abas").tabs();
});

/*
    Verifica os métodos a serem usados para analize da fórmula
*/
function getConfig()
{
    var config = {};
    
    config.relatorio = document.getElementById("rel").checked;
    config.tabelaVerdade = document.getElementById("TV").checked;
    config.arvoreSemantica = document.getElementById("AS").checked;
    //config.tableauxSemantico = document.getElementById("TS").checked;
    
    return config;
}



/*
    Troca letras maiúsculas por minúsculas e os sinais usados pelo usuário pelos sinais lógicos (caracteres aceitos pela camada de negócios)
    Retorno:
        string: fórmula normatizada
*/
function normatizaFormula (formula)
{
    var i=0;
    var j=0;
    var aux = "";
    
    E = String.fromCharCode(8743);
    OU = String.fromCharCode(8744);
    NAO = String.fromCharCode(172);
    IMP = String.fromCharCode(8594);
    BIMP = String.fromCharCode(8596);
    
    while(formula.search(' ') != -1)
        formula = formula.replace(' ', '');
    while(formula.search('&') != -1)
        formula = formula.replace('&', E);
    while(formula.indexOf('|') != -1)
        formula = formula.replace('|', OU);
    while(formula.search('~') != -1)
        formula = formula.replace('~', NAO);
    while(formula.search('>') != -1)
        formula = formula.replace('>', IMP);
    while(formula.search('=') != -1)
        formula = formula.replace('=', BIMP);
    formula = formula.toUpperCase();

    return formula;
}





/*
    Funcão executada ao clicar no botão verificar
*/
function main ()
{
    var aux = "";
    var relatorio = "";
    var tabela = "";
    
    $("#relatorio").html("");
    $("#tabverdade").html("");
    $("#arvoreSemantica").html("");
    
    var configuracoes = getConfig();
    if (!configuracoes.relatorio && !configuracoes.tabelaVerdade && !configuracoes.arvoreSemantica)
        return 0;

    var formula = document.getElementById("formula").value;
    formula = normatizaFormula(formula);
    
    relatorio += "<strong>Fórmula:</strong> " + formula + "<br><br>";

    aux = validaFormula(formula);
    if (aux.length != 0)
    {
        relatorio += '<div class="ui-state-error ui-corner-all">';
        relatorio += '<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>';
        relatorio += '<strong>Erro: </strong>';
        relatorio += aux;
        relatorio += '</p></div>';
        
        $("#relatorio").html(relatorio);
        $("#abas").tabs('select', 2);
        return 0;
    }

    if (configuracoes.relatorio || configuracoes.tabelaVerdade)
        tabela = gerarTabela(formula);
        
    if (configuracoes.relatorio)
        imprimirFormulario(formula, tabela);

    if (configuracoes.tabelaVerdade)
        imprimirTabela(formula, tabela);

    subformulas(formula);
        
//    if (configuracoes.arvoreSemantica)
//        gerarArvore(formula, tabela);
        
    $("#abas").tabs('select', 2);
}



/*
    Gera e imprime um relatório sobre a formula
*/
function imprimirFormulario (formula, tabela)
{
    var aux;
    var relatorio = "";
    var v, f;

    // Fórmula normatizada
    relatorio += "<strong>Fórmula:</strong> " + formula + "<br><br>";
    
    
    // Estatísticas da fórmula (simbolos, comprimento)
    aux = procura_Simb_Prop(formula);
    relatorio += "<strong>Símbolos proposicionais: </strong>";
    for (i in aux)  relatorio += aux.charAt(i) + " ";
    relatorio += "<br>"
    aux = procura_Con_Log(formula);
    relatorio += "<strong>Conectivos lógicos: </strong>" + aux + "<br>";
    aux = comprimento(formula);
    relatorio += "<strong>Comprimento: </strong>" + aux + "<br><br>";

    
    // Classificação e modos normais
    v = f = 0;
    relatorio += "<strong>Classificação: </strong>";
    for (i in tabela)
    {
        if (tabela[i][1] == '1')
            v++;
        else
            f++;
        if (v && f)
            break;
    }
    
    if (v && f)
    {
        relatorio += "Contingência<br><br>";
        aux = FND (procura_Simb_Prop(formula), tabela);
        relatorio += "<strong>FND: </strong>" + aux + "<br>";    
        aux = FNC (procura_Simb_Prop(formula), tabela);
        relatorio += "<strong>FNC: </strong>" + aux + "<br>";
    }
    else if (v)
    {
        relatorio += "Tautologia<br><br>";
        relatorio += "<strong>FND: </strong>1<br>";
        relatorio += "<strong>FNC: </strong>1<br>";
    }
    else
    {
        relatorio += "Contradição<br><br>";
        relatorio += "<strong>FND: </strong>0<br>";
        relatorio += "<strong>FNC: </strong>0<br>";
    }
    relatorio += "<br><br>";
    
    $("#relatorio").html(relatorio);
}



/*
    Gera e imprime um relatório sobre a formula
*/
function imprimirTabela (formula, tabela)
{
    var simbProp = procura_Simb_Prop(formula);
    var aux;
    var str = "<center><table class='resultado'>";
    
    aux = simbProp.length;
    // Equação não possui símbolos proposicionais
    if (aux == 0)
    {
        str += "<tr><td>" + formula + "</td></tr>";
        str += "<tr><td>" + tabela[0][1] + "</td></tr>";
    }
    // Equação é composta por somente um símbolo proposicional
    else if (aux == 1 && formula.length == 1)
    {
        str += "<tr><td>" + formula + "</td></tr>";
        str += "<tr><td>" + tabela[0][1] + "</td></tr>";
        str += "<tr><td>" + tabela[1][1] + "</td></tr>";
    }
    //  Restante
    else
    {
        str += "<tr>";
        for (i in simbProp)
            str += "<td>" + simbProp.charAt(i) + "</td>";
        str += "<td>" + formula + "</td>";
        str += "</tr>"
        
        for (i in tabela)
        {
            str += "<tr>";
            
            aux = tabela[i][0];
            for (j in aux)
                str += "<td>" + aux.charAt(j) + "</td>";
            str += "<td>" + tabela[i][1] + "</td>";
            
            str += "</tr>";
        }
    }
    
    str += "</table></center>";

    $("#tabVerdade").html(str);
}












