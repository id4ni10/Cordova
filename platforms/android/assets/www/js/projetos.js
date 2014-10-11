function inserirProjeto() {

    var cliente = $("#cadastro-cliente").val();
    var contrato = $("#cadastro-contrato").val();
    var descricao = $("#cadastro-descricao").val();
    var projeto = $("#cadastro-projeto").val();
    var horas = $("#cadastro-horas").val();

    jQuery.ajax({
        url: 'https://script.google.com/macros/s/AKfycbzwYPK5jIKd40nAx2KgAADV0kuC24oHbc3WSFQgBU1Vy8VHh-qT/exec?' + 'contrato=' + contrato + '&proj=' + projeto + '&desc=' + descricao + '&cli=' + cliente + '&horas=' + horas,
        success: function (data) { eval(data); },
        error: function (data) { alert('Erro de comunicação. Impossível inserir o projeto.'); }
    });

    limparFormulario();
    history.back();
}


function limparFormulario() {
    $('#frm').each(function () {
        this.reset();
    });
}

function loadProjetos(content) {
    $('#list_projetos li:not(:first)').remove();

    $("#list_projetos").addRow(content, ['projeto'], function (key, obj, idx) {

        if (key == 'projeto') {
            return '<a href="#view_config" data-transition="slide" onclick="carregarProjeto(\'' + obj.projeto + '\');">' + obj['projeto'] + '</a>';
        }

    });
}

function carregarProjeto(projeto) {

    jQuery.ajax({
        url: 'https://spreadsheets.google.com/feeds/list/1v7IJTOPE9WOV1Iscn1_4X34OJeSFI4U0APQSb0nIjr4/od6/public/values?alt=json&sq=projeto="' + projeto + '"',
        type: 'GET',
        dataType: 'jsonp',
        success: function (data) {

            var list = data['feed']['entry'];

            for (x = 0; x < list.length; x++) {
                $("#cadastro-cliente").val(list[x]['gsx$cliente']['$t']);
                $("#cadastro-contrato").val(list[x]['gsx$contrato']['$t']);
                $("#cadastro-descricao").val(list[x]['gsx$descrição']['$t']);
                $("#cadastro-projeto").val(list[x]['gsx$projeto']['$t']);
                $("#cadastro-horas").val(list[x]['gsx$totalhoras']['$t']);
            }
        },
        error: function (data) {
            showMessage('Erro de comunicação. Impossível carregar o projeto.');
        }
    });
}

function retorno(e) {
    alert(e);
}

function showMessage(msg) {
    $('#msg').text(msg);
    $('#popupDialog').popup('open');
}

function findAllProjetos() {

    jQuery.ajax({
        url: 'https://spreadsheets.google.com/feeds/list/1v7IJTOPE9WOV1Iscn1_4X34OJeSFI4U0APQSb0nIjr4/od6/public/values?alt=json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            projetos = [];

            var list = data['feed']['entry'];

            for (x = 0; x < list.length; x++) {

                var obj = {
                    "cliente": list[x]['gsx$cliente']['$t'],
                    "contrato": list[x]['gsx$contrato']['$t'],
                    "descrição": list[x]['gsx$descrição']['$t'],
                    "projeto": list[x]['gsx$projeto']['$t'],
                    "totalhoras": list[x]['gsx$totalhoras']['$t']
                };
                projetos.push(obj);
            }

            loadProjetos(projetos);
        },
        error: function (data) {
            showMessage('Erro de comunicação. Impossível carregar os projetos.');
        }
    });
}


$(document).ready(function () {

    $(document).ajaxSend(function (event, request, settings) {

        var $this = $('#loading'),
			        theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
			        msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
			        textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
			        textonly = !!$this.jqmData("textonly");
        html = $this.jqmData("html") || "";
        $.mobile.loading("show", {
            text: msgText,
            textVisible: textVisible,
            theme: theme,
            textonly: textonly,
            html: html
        });

    });

    $("#cadastro-adicionar").click(function (event) {
        event.preventDefault();
        inserirProjeto();
    });

    $(document).ajaxComplete(function (event, request, settings) {
        $.mobile.loading("hide");
    });

    findAllProjetos();

});

(function ($) {
    $.fn.addRow = function (info, keys, func) {
        var tabela = this;
        $.each(info, function (i, value) {
            var tr = "";
            $.each(keys, function (idx, val) {
                if (func != undefined) {
                    var conteudo = func(val, value, i);
                    tr += "<li>" + ((conteudo == undefined) ? value[val] : conteudo) + "</li>";
                } else {
                    tr += "<li>" + value[val] + "</li>";
                }

            });
            $(tabela).append(tr);
            $(tabela).listview("refresh");
        });
        return this;
    };
})(jQuery);