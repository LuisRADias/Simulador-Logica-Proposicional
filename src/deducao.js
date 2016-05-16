

function subformulas (formula)
{
    var retorono = [];
    var parenteses;
    var n, i;
    
    n = formula.length;
    i = 0;
    while (i < n)
    {
        // ignorar parenteses
        if (formula.charAt(i) == '(')
        {
            parenteses = 1;
            i++;
            
            while (parenteses)
            {
                if (formula.charAt(i) == '(')
                    parenteses++;
                if (formula.charAt(i) == ')')
                    parenteses--;
                i++;
            }
        }
        
        
        i++;
    }
    
    
    return retorono;
}