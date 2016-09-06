function DOM_operation(){
    /*type one
     * addClass
     * removeClass
     * toggleClass
     */
    /*type two
     * attr
     * removeAttr
     */
}
function setAttr(){
    //set two or more attribute on one dom node but should diff with set css style
    //the function attr is same with prop eg:$(this).prop('class','className');
    $('#setAttr_div').attr({
        class:'setAttr_div',
        name:'setAttr_div'
    });
}
