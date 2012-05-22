
function compileCode(text)
{
    var pos = text.indexOf("<#");
    
    if (pos < 0)
        return "writer.write('" + text + "');";
        
    var code = '';
        
    var left = text.slice(0, pos);
    
    if (left)
        code = compileToCode(left);
    
    var pos2 = text.indexOf("#>");
    
    var cmd = text.slice(pos + 2, pos2);
    
    code += cmd;
    
    var right = text.slice(pos2 + 2);
    
    if (right)
        code += compileToCode(right);
        
    return code;
}

function compileToCode(text)
{
    var pos = text.indexOf("${");
    
    if (pos < 0)
        return compileCode(text);
        
    var code = '';
        
    var left = text.slice(0, pos);
    
    if (left)
        code = compileCode(left);
    
    var pos2 = text.indexOf("}");
    
    var expr = text.slice(pos + 2, pos2);
    
    code += "writer.write(" + expr +");";
    
    var right = text.slice(pos2 + 1);
    
    if (right)
        code += compileToCode(right);
        
    return code;
}

function compileTemplate($text) {
    var $code = compileToCode($text);
    console.log($code);
    return new Function("writer", $code);
};

exports.compileTemplate = compileTemplate;