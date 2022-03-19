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
        { "name": "提交", "url": "img/true.png" },
        { "name": "院级审批", "url": "img/true.png" },
        { "name": "校级审批", "url": "img/true.png" }
    ]
}


function completeDate(value) {
    return value < 10 ? "0" + value : value;
}

function getNowFormatDay(nowDate) {
    var char = "-";
    if (nowDate == null) {
        nowDate = new Date();
    }
    var day = nowDate.getDate();
    var month = nowDate.getMonth() + 1;
    var year = nowDate.getFullYear();
    return year + char + completeDate(month) + char + completeDate(day);
}
var Global_FN = {
    init() {
        layui.use(['jquery'], function() {
            let $ = layui.jquery;
            var data;
            if (location.hash === '') {
                data = $.getJSON({ url: "api/jailbreak/student/", async: false });
            } else {
                data = $.getJSON({ url: "api/jailbreak/student/" + location.hash.replace('#', ''), async: false });
                if (data['status'] === 'failed') {
                    data = $.getJSON({ url: "api/jailbreak/student/", async: false });
                }
            }
            data = data.responseJSON
            console.log(data)
            Info.scutInfo[0].value = data['data']['name'];
            Info.scutInfo[1].value = data['data']['id'];
            Info.scutInfo[2].value = data['data']['college'];
            Info.scutInfo[3].value = data['data']['class'];
            Info.scutInfo[4].value = '本科生'
            var date = new Date()
            $(".dOutStartDate").text(getNowFormatDay());
            $(".dOutEndDate").text(getNowFormatDay());
            $("#reason").text(data['data']['reason']);
            $("#addr").val(data['data']['addr']);

            $("input[name$='scutName']").val(data['data']['name']);
            $("input[name$='scutCode']").val(data['data']['id']);
            $("input[name$='scutCollege']").val(data['data']['college']);
            $("input[name$='scutGrade']").val(data['data']['class']);
            $("input[name$='scutDegree']").val('本科生');

            Global_FN.fillStepBox();
            Global_FN.initDatePicker();
            
        });
    },
    fillStepBox() { // 渲染进度栏
        layui.use(["jquery"], function() {
            let $ = layui.jquery;
            $(".step_box").empty();
            let sList = "";
            $.each(Info.stepBox, (index, item) => {
                let sLine = "";
                index != Info.stepBox.length - 1 ? sLine = "line" : "";
                sList += '<div class="step ' + sLine + '"><img src="' + item.url + '"><span>' + item.name + '</span></div>'
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
        layui.use(['form', 'jquery'], function() {
            let $ = layui.jquery;

            Info.stepBox[0].url = "img/true.png";
            Info.stepBox[1].url = "img/true.png";
            Info.stepBox[2].url = "img/true.png";

            Info.scutInfo[0].value = $("input[name$='scutName']").val();
            Info.scutInfo[1].value = $("input[name$='scutCode']").val();
            Info.scutInfo[2].value = $("input[name$='scutCollege']").val();
            Info.scutInfo[3].value = $("input[name$='scutGrade']").val();
            
            let htmlContent = "";
            $(".info_box").empty();
            $.each(Info.scutInfo, (_index, item) => {
                htmlContent += '<div class="info_list"><span>' + item.label + '</span><span>' + item.value + '</span></div>';
            })
            $(".info_box").html(htmlContent);

            $(".mask").show();
            $(".btn_add").hide();
            $(".logo_box").show();
            $(".info_input").hide();
            $(".logo_box img").attr("src", "./img/pass.png");
        });
    },
    sub() {
        Global_FN.fillScutInfo();
    }
}
