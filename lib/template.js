
function compileCode(text, values)
{
    var pos = text.indexOf("<#");
    
    if (pos < 0)
    {        
        var l = values.length;
        values.push(text);
       
        return "writer.write($values[" + l + "]);";
    }
        
    var code = '';
        
    var left = text.slice(0, pos);
    
    if (left)
        code = compileToCode(left, values);
    
    var pos2 = text.indexOf("#>");
    
    var cmd = text.slice(pos + 2, pos2);
    
    code += cmd;
    
    var right = text.slice(pos2 + 2);
    
    if (right)
        code += compileToCode(right, values);
        
    return code;
}

function compileToCode(text, values)
{
    var pos = text.indexOf("${");
    
    if (pos < 0)
        return compileCode(text, values);
        
    var code = '';
        
    var left = text.slice(0, pos);
    
    if (left)
        code = compileCode(left, values);
    
    var pos2 = text.indexOf("}");
    
    var expr = text.slice(pos + 2, pos2);
    
    code += "writer.write(" + expr +");";
    
    var right = text.slice(pos2 + 1);
    
    if (right)
        code += compileToCode(right, values);
        
    return code;
}

function compileTemplate($text) {
    var $values = [];
    var $code = compileToCode($text, $values);
    console.log($code);
    var fun = new Function("writer", "$values", $code);
    return function(writer) { return fun(writer, $values); }
};

exports.compileTemplate = compileTemplate;