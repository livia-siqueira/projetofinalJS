(function (win, $, doc) {
    'use-scrict';

    var app = (function () {
        var inputs = $("[data-js='input']");
        var tbody = doc.getElementById("tbody");
        var dates;

        return {
            init: function init() {
                this.createAjax();
                this.initEvents();
                this.allCars();
            },

            initEvents: function initEvents() {
                $("[data-js='submitCar']").on('click', this.insereCarTable);
            },

            createAjax: function createAjax() {
                var Ajax = new XMLHttpRequest();
                Ajax.open('GET', './company.json');
                Ajax.send();
                Ajax.addEventListener('readystatechange', function () {
                    if (!(Ajax.readyState === 4 && Ajax.status === 200)) return "Não foi possivel completar sua requisição";
                    var myCompany = JSON.parse(Ajax.responseText);
                    app.addNameCompany(myCompany.name, myCompany.phone);
                })
            },
            addNameCompany: function addNameCompany(name, phone) {
                var $div = doc.getElementById("Names");
                $div.innerHTML = `<h1>${name}</h1><h2>${phone}</h2>`;
            },

            insereCarTable: function insereCarTable(e) {
                e.preventDefault();
                dates = [];
                inputs.forEach(input => {
                    dates.push(input.value);
                });
                if (!app.verificaInput()) return alert("Preencha todos os dados");
                app.addTable(dates);
                app.saveCar();
                app.resetInpus();
            },

            addTable: function addTable(array){
                tbody.insertAdjacentHTML('beforeend', '<tr data-js="tr"></tr>');
                var tr;
                array.forEach(item => {
                    tr = tbody.lastChild;
                    if ((/jpg|jpeg|png/g).test(item)) return app.insereImg(tr, item);
                    tr.insertAdjacentHTML('beforeend', `<td>${item}</td>`)
                });
                app.insereButtonRemove(tr);
            },

            insereImg: function insereImg(trNew, item) {
                trNew.insertAdjacentHTML('beforeend', `<td><img src=${item}></td>`);
            },

            insereButtonRemove: function insereButtonRemove(trNew) {
                trNew.insertAdjacentHTML('beforeend', '<td><button data-js="buttonRemoved">X</button></td>');
                this.createEventButton();
            },

            allCars: function allCars() {
                var get = new XMLHttpRequest();
                get.open('GET', 'http://localhost:3000/car');
                get.send();
                get.addEventListener('readystatechange', function () {
                    if (get.readyState === 4 && get.status === 200) {
                        var cars = JSON.parse(get.responseText);
                        cars.forEach(item =>{
                            dates=[];
                            dates.push(item.image,item.brandModel, item.plate, item.year, item.color);
                            app.addTable(dates);
                        })
                    }
                });
            },

            saveCar: function saveCar() {
                var post = new XMLHttpRequest();
                post.open('POST', 'http://localhost:3000/car');
                post.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                post.send(
                    `image=${dates[0]}&brandModel=${dates[1]}&plate=${dates[2]}&year=${dates[3]}&color=${dates[4]}`
                );
                post.addEventListener('readystatechange', function(){
                    if(post.status === 200 && post.readyState === 4){
                       alert("Carro salvo!");
                    }
                });
            },

            createEventButton: function createEventButton() {
                $("[data-js='buttonRemoved']").on('click', function () {
                    var fater = this.parentNode;
                    var item = fater.parentNode;
                    var placa = item.children[2];
                    app.removeCarServer(placa.innerHTML);
                });
               
            },

            removeCarServer: function removeCarServer(placa){
                var post = new XMLHttpRequest();
                post.open('DELETE', 'http://localhost:3000/car');
                post.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                post.send(`plate=${placa}`);
                win.location.reload();
            },

            verificaInput: function verificaInput() {
                function isClean(item) { return item !== ''; }
                return dates.every(isClean);
            },

            resetInpus: function resetInpus(){
                inputs.forEach(item => {
                    item.value = '';
                });
            }
        };
    })();
    app.init();
})(window, window.DOM, document)