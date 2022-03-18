'use strict';
window.onload = function() {
    Global_FN.init();
}

var Info = {
    scutInfo: [ // 个人信息
        { label: "姓名", value: "-" },
        { label: "学号", value: "-" },
        { label: "学院", value: "-" },
        { label: "年级", value: "-" },
        { label: "人员类型", value: "-" }
	],
    stepBox: [ // 步骤栏
        { "name": "提交", "url": "img/unTrue.png" },
        { "name": "院级审批", "url": "img/unTrue.png" },
        { "name": "校级审批", "url": "img/unTrue.png" }
    ]
}

var Global_FN = {
    init() {
        layui.use(['jquery'], function() {
            if (Global_FN.getQuery('fill') === 'true') {
                Global_FN.fillScutInfo();
            }
            Global_FN.fillStepBox();
            Global_FN.initDatePicker();
        });
    },
    getQuery(param) { // 获取URL参数
        var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r === null) { return null; }
        return decodeURI(r[2]);
    },
    fillStepBox() { // 渲染进度栏
        layui.use(["jquery"], function() {
            let $ = layui.jquery;
            $(".step_box").empty();
            let sList = "";
            $.each(Info.stepBox, (index, item) => {
                let sLine = "";
                index != Info.stepBox.length - 1 ? sLine = "line" : "";
                sList += '<div class="step '+ sLine +'"><img src="'+ item.url +'"><span>'+ item.name +'</span></div>'
            })
            $(".step_box").html(sList);
        });
    },
    initDatePicker() { // 初始化日期控件
        Global_FN.datePickerBindChange("dOutStartDate"); // 开始日期
        Global_FN.datePickerBindChange("dOutEndDate"); // 结束日期
    },
    datePickerBindChange(value) { // 日期组件事件绑定
        layui.use([], function() {
            let $ = layui.jquery;
            $('#' + value).on('click', function() {
                weui.datePicker({
                    start: 1990,
                    end: new Date().getFullYear() + 1,
                    onConfirm: function(result) {
                        var mm = "",
                        dd = "";
                        result[1].value.toString().length === 1 ? mm = "0" + result[1].value : mm = result[1].value;
                        result[2].value.toString().length === 1 ? dd = "0" + result[2].value : dd = result[2].value;
                        $('.' + value).text(result[0].value + "-" + mm + "-" + dd);
                    },
                    title: '日期'
                });
            });
        });
    },
    fillScutInfo() { // 填充数据
        layui.use(['form','jquery'], function() {
            let $ = layui.jquery;

            Info.stepBox[0].url = "img/true.png";
            Info.stepBox[1].url = "img/true.png";
            Info.stepBox[2].url = "img/true.png";

            $(".dOutStartDate").text(Global_FN.getQuery('start') || '1970-01-01');
            $(".dOutEndDate").text(Global_FN.getQuery('end') || '1970-01-01');

            layui.form.val('info_form', {
                sOutAddress: Global_FN.getQuery('address') || '',
                sOutReason: Global_FN.getQuery('reason') || '',
            });

            Info.scutInfo[0].value = Global_FN.getQuery('name') || '-';
            Info.scutInfo[1].value = Global_FN.getQuery('code') || '-';
            Info.scutInfo[2].value = Global_FN.getQuery('college') || '-';
            Info.scutInfo[3].value = Global_FN.getQuery('grade') || '-';
            Info.scutInfo[4].value = Global_FN.getQuery('degree') || '-';

            let htmlContent = "";
            $(".info_box").empty();
            $.each(Info.scutInfo, (_index, item) => {
                htmlContent += '<div class="info_list"><span>'+ item.label +'</span><span>'+ item.value +'</span></div>';
            })
            $(".info_box").html(htmlContent);

            $(".mask").show();
            $(".btn_add").hide();
            $(".logo_box").show();
            $(".info_input").hide();
            $(".logo_box img").attr("src" ,"./img/pass.png");
        });
    },
    sub() {
        let $ = layui.jquery;
        let formData = layui.form.val("info_form");
        var info = {
            'start': $(".dOutStartDate").text(),
            'end': $(".dOutEndDate").text(),
            'address': formData['sOutAddress'],
            'reason': formData['sOutReason'],
            'name': formData['scutName'],
            'code': formData['scutCode'],
            'college': formData['scutCollege'],
            'grade': formData['scutGrade'],
            'degree': formData['scutDegree'],
        }
        let query = '?fill=true&';
        $.each(info, (index, item) => {
            query += index + '=' + item + '&'
        })
        query = query.substr(0, query.length - 1);
        window.location.href = 'apply.html' + query;
    }
}
