var E, OU, NAO, IMP, BIMP;

/*
    Retorno: comprimento da f�rmula
*/
function comprimento (formula)
{
    var aux;
    var retorno = 0;

    for (var i=0; i<formula.length; i++)
    {
        aux = formula.charAt(i);
        if (aux != '(' && aux != ')')
        {
            retorno++;
        }
    }
    return retorno;
}

/*
    Retorno: (string) Simbolos proposicionais presentes na f�rmula
*/
function procura_Simb_Prop (formula)
{
    var aux;
    var retorno = "";

    for (var i=0; i<formula.length; i++)
    {
        aux = formula.charAt(i);
        
        if (aux >= 'A' && aux <= 'Z')
        {
            if (retorno.indexOf(aux) == -1)
                retorno = retorno.concat(aux);
        }
    }
    
    return retorno;
}

/*
    Retorno: (string) Conectivos l�gicos presentes na f�rmula
*/
function procura_Con_Log (formula)
{
    var aux;
    var retorno = "";

    for (var i=0; i<formula.length; i++)
    {
        aux = formula.charAt(i);
        
        if ((aux < 'A' || aux > 'Z') && aux != '(' && aux != ')' && aux != '0' && aux != '1')
        {
            if (retorno.indexOf(aux) == -1)
                retorno = retorno.concat(aux + " ");
        }
    }
    return retorno;
}


/*
    Retorna a forma normal dijuntiva dados os s�mbolos propocisionais e a tabela verdade da f�rmula
*/
function FND (simbolosProp, tabela)
{
    var resultado = "";
    var aux = 2;
    
    if (!simbolosProp.length)
        return tabela[0][1];
    
    aux = Math.pow(2, simbolosProp.length);    
    for (var i=0; i<aux; i++)
    {
        if (tabela[i][1] == '1')
        {
            if (resultado.length != 0)
                resultado += " " + OU + " ";
            resultado += '(';
            
            for (indice in simbolosProp)
            {
                if (indice != '0')
                    resultado += " " + E;
                if (tabela[i][0].charAt(indice) == '1')
                {
                    resultado += " " + simbolosProp.charAt(indice);
                }
                else
                {
                    resultado += " " + NAO + simbolosProp.charAt(indice);
                }
            }
            
            resultado += ' )';
        }
    }
    
    return resultado;
}



/*
    Retorna a forma normal conjuntiva dados os s�mbolos propocisionais e a tabela verdade da f�rmula
*/
function FNC (simbolosProp, tabela)
{
    var resultado = "";
    var aux = 2;
    
    if (!simbolosProp.length)
        return tabela[0][1];
    
    aux = Math.pow(2, simbolosProp.length);    
    for (var i=0; i<aux; i++)
    {
        if (tabela[i][1] == '0')
        {
            if (resultado.length != 0)
                resultado += " " + E + " ";
            resultado += '(';
            
            for (indice in simbolosProp)
            {
                if (indice != '0')
                    resultado += " " + OU;
                if (tabela[i][0].charAt(indice) == '1')
                {
                    resultado += " " + NAO + simbolosProp.charAt(indice);
                }
                else
                {
                    resultado += " " + simbolosProp.charAt(indice);
                }
            }
            
            resultado += ' )';
        }
    }
    
    return resultado;
}






/*
    Verifica se h� caracteres inv�lido na f�rmula
    Retorno: (string) caracteres inv�lidos separados por espa�o
*/
function verificaCaracteres (formula)
{
    var aux = "";
    
    for (var i=0; i<formula.length; i++)
    {
        if (formula.charAt(i) >= 'a' && formula.charAt(i) <= 'z') {}
        else
        {
            if (formula.charAt(i) >= 'A' && formula.charAt(i) <= 'Z') {}
            else
            {
                if (formula.charAt(i) == E || formula.charAt(i) == OU || formula.charAt(i) == IMP || formula.charAt(i) == BIMP) {}
                else
                {
                    if (formula.charAt(i) == NAO || formula.charAt(i) == '(' || formula.charAt(i) == ')') {}
                    else
                    {
                        if (formula.charAt(i) != '0' && formula.charAt(i) != '1')
                        {
                            if (aux.indexOf(formula.charAt(i)) == -1)
                            {
                                aux += formula.charAt(i) + " ";
                            }
                        }
                    }
                }
            }
        }
    }
    
    return aux;
}



/*
    Verifica se todos os '(' possuem ')' correnpondentes e vice-versa
    Retorno:    0 - sem erros
                1 - Excesso de '('
                2 - Excesso de ')'
*/
function verificaParenteses ()
{
    var parentese = 0;

    for (var i=0; i<formula.length; i++)
    {
        if (formula.charAt(i) == '(')
            parentese++;
        else if (formula.charAt(i) == ')')
            parentese--;
            
        if (parentese < 0)
            return 2;
    }
    
    if (parentese > 0)
        return 1;
    
    return 0;
}



/*
    Verifica as regras de constru��o da f�rmula
    Retorno:    0 - sem erros
                1 - F�rmula vazia ou parenteses vazios
                2 - Dois s�mbolos proposicionais seguidos
                3 - Conectivo l�gico n�o circulado por proposi��es
                4 - Nega��o n�o sucedido por proposi��o
*/
function verificaSintaxe (form)
{
    var aux, temp;
    var i;
    var letra, sinal, neg;
    
    if (form.length == 0)
        return 1;
 
    // Verifica parentiza��o
    aux = form.indexOf('(');
    while (aux != -1)
    {
        temp = 0
        for (i=aux+1; i<form.length; i++)
        {
            if (form.charAt(i) == '(')
                temp++;
            if (form.charAt(i) == ')')
                temp--;
             
            if (temp < 0)
                break;
        }
        
        temp = form.slice(aux+1, i);
        form = form.replace(form.substring(aux, i+1), '0');
        i = verificaSintaxe(temp);
        if (i)
            return i;
            
        aux = form.indexOf('(');
    }
    
    
    
    // Verifica sem�ntica
    letra = sinal = neg = 0;
    i=0
    while (i<form.length)
    {
        if ((form.charAt(i) >= 'A' && form.charAt(i) <= 'Z') || form.charAt(i) == '0' || form.charAt(i) == '1')
        {
            if (letra)
                return 2;
            letra = 1;
            sinal = neg = 0;
        }
        if (form.charAt(i) == E || form.charAt(i) == OU || form.charAt(i) == IMP || form.charAt(i) == BIMP)
        {
            if (sinal || !letra)
                return 3;
            if (neg)
                return 4;
            sinal = 1;
            letra = neg = 0;
        }
        if (form.charAt(i) == NAO)
        {
            while (form.charAt(i+1) == NAO)
                i++;
            neg = 1;
        }
        i++;
    }
    
    if (sinal)
        return 3;
    if (neg)
        return 4;
    
    return 0;
}



/*
    Fun��o respons�vel por verificar se a f�rmula � uma FBF
*/
function validaFormula (formula)
{
    var aux = "";
    var erro;
    
    aux = verificaCaracteres(formula);
    if (aux.length != 0)
        return 'Foram encontrados os seguintes caracteres inv�lidos: ' + aux;

    erro = verificaParenteses();
    if (erro != 0)
    {
        if (erro == 1)
            aux = "Existe '(' sem ')' correspondente";
        else
            aux = "Existe ')' sem '(' correspondente";
        
        return aux;
    }
    
    switch (verificaSintaxe(formula))
    {
        case 0: aux = "";
                break;
        
        case 1: aux = "F�rmula ou sinais de pontua��o vazios.";
                break;
                
        case 2: aux = "Foram emcontradas duas proposi��es n�o separadas por conectivos l�gicos diferentes de '�'.";
                break;
                
        case 3: aux = "Foram encontrado conectivos l�gicos diferentes de '�' n�o separados por proposi��o.";
                break;
                
        case 4: aux = "Foi econtrado conectivo l�gico de nega��o (�) n�o sucedido por proposi��o";
                break;
    }

    return aux;
}