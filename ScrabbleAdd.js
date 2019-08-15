(function(){

    const players = [{
            name: document.querySelector('#pl1name'),
            list: document.querySelector('#pl1list'),
            total: document.querySelector('#pl1res'),
            field: document.querySelector('#pl1'),
            status: document.querySelector('#status1'),
        },{
            name: document.querySelector('#pl2name'),
            list: document.querySelector('#pl2list'),
            total: document.querySelector('#pl2res'),
            field: document.querySelector('#pl2'),
            status: document.querySelector('#status2'),
    }];
    
    let game = {
        name: '',
        players: [
            {name:'', score:0, moves: []},
            {name:'', score:0, moves: []},
        ]
    }
    
    const calculatetotals = () => {
        players.forEach((player,key) => {
            let total = 0;
            game.players[key].moves = [];
            [...players[key].list.querySelectorAll('li')].forEach((item => {
                total += +item.dataset.points;
                game.players[key].moves.push({
                    word:item.dataset.word,
                    value:+item.dataset.points
                });
                game.players[key].score = total;
            }));
            players[key].total.innerText = total;
        });
        let delta = (players[0].score - players[1].score);
        if (delta === 0) {
            players[0].status.innerText = '';
            players[1].status.innerText = '';
        }
        if (delta < 0) {
            players[0].status.innerText = '😒';
            players[1].status.innerText = '😁';
            players[1].total.innerText = `${players[1].score} (+${-delta})`;
        }
        if (delta > 0) {
            players[0].status.innerText = '😁';
            players[1].status.innerText = '😒';
            players[0].total.innerText = `${players[0].score} (+${delta})`;
        }
        window.localStorage.setItem(
            game.name, 
            JSON.stringify(game)
        );
    };

    /* Restore old game */

    const restore = function(gamename) {
        let data = JSON.parse(window.localStorage.getItem(gamename));
        game = data;
        players[0].name.value = data.players[0].name
        players[1].name.value = data.players[1].name
        data.players.forEach((player, key) => {
            player.moves.forEach(item => {
                players[key].list.innerHTML += `
                <li data-word="${item.word}" 
                    data-points=${item.value}>
                    ${item.word} ${item.value}
                    <button>x</button>
                </li>`;
            });
        });
        document.querySelector('.menu').style.display ='none';
        document.querySelector('.footer').style.visibility ='visible';
        players[0].field.focus();
        calculatetotals();
    }
    
    /* Removing List Item */
    
    const removeListItem = (item) => {
        item.parentNode.parentNode.removeChild(item.parentNode);
        calculatetotals();
    };
     
    /* Adding List item */
    
    const addListItem = (id) => {
        let value = players[id].field.value;
        if (value.indexOf(' ') === -1) {
            value = value.replace(/(\d)/,' $1');
        }
        let word = value.replace(/\s+?\d+/,'').toUpperCase();
        let points = +value.match(/-?\d+/);
        players[id].list.innerHTML += `
        <li data-word="${word}" 
            data-points=${points}>
            ${word} ${points}
            <button>x</button>
        </li>`;
        players[id].field.value = '';
        players[id].list.lastChild.scrollIntoView({behavior: 'smooth'});
        calculatetotals();
    }
    
    const dogameaction = (action) => {
        if (action === 'newgame') {
            game.name = document.querySelector('#n').value;
            game.players[0].name = players[0].name.value;
            game.players[1].name = players[1].name.value;
            players[0].list.innerHTML = '';
            players[1].list.innerHTML = '';
            players[0].total.innerHTML = 0;
            players[1].total.innerHTML = 0;
            document.querySelector('.menu').style.display ='none';
            document.querySelector('.footer').style.visibility ='visible';
            players[0].field.focus();
        }
        if (action === 'restore') {
            for (let i = 0; i < localStorage.length; i++) {
                document.querySelector('#gameslist').innerHTML += `
                    <li><button data-name="${localStorage.key(i)}">${localStorage.key(i)}</button></li>
                `;
        }
        }
        if (action === 'purge') {
            let itburn = window.confirm('This will delete all stored games, are you sure?');
            if (itburn) {
                window.localStorage.clear();
            }
        }
    };
    
    /* Event handlers */
    
    document.querySelector('#gameslist').addEventListener('click', ev => {
        if (ev.target.nodeName.toLowerCase() === 'button') {
            restore(ev.target.dataset.name);
        }
        ev.preventDefault();
    });


    document.querySelector('#resultslists').addEventListener('click', ev => {
        if (ev.target.nodeName.toLowerCase() === 'button') {
            removeListItem(ev.target);
        }
        ev.preventDefault();
    });
    
    document.querySelector('#moveform').addEventListener('submit', ev => {
        if (players[0].field.value !== '' || players[1].field.value !== '') {
            let player =  (players[0].field.value === '') ? 1 : 0;
            addListItem(player);    
        }
        ev.preventDefault();
    });
    
    document.querySelector('.header').addEventListener('click', (ev) => {
        if (ev.target.nodeName.toLowerCase() === 'input') {
            ev.target.type = (ev.target.type === 'button') ? 'text' : 'button';
            ev.preventDefault();
        }
    });

    document.querySelector('.menu').addEventListener('click', (ev) => {
        if (ev.target.nodeName.toLowerCase() === 'button') {
            dogameaction(ev.target.value);
            ev.preventDefault();
        }
    });
    window.onload = () => {
        if (window.location.href.indexOf('debug') === -1) {
            document.querySelector('.footer').style.visibility ='hidden';
        }
        if (localStorage.length === 0) {
            document.querySelector('#restorebutton').style.display = 'none';
            document.querySelector('#purgebutton').style.display = 'none';
        }
    }
    
    /* Debug stuff */
    
    function testfill() {
        let now = '1';
        const words = 'Obacht! Das hurtig Quasselstrippe ergötzen. Der hochnäsig Kerbholz. Günstling und Affenzahn frickeln piesacken Springinsfeld. Der pomadig Schelm katzbuckeln. Der hanebüchen Bordsteinschwalbe jauchzen. Das halsstarrig Kokolores lobpreisen. Die halbstark Sülze liebkosen. Die Dreikäsehoch verhaspeln das feist Dreikäsehoch. Kesselflicker und Kinkerlitzchen krakelen halbstark Mettigel. Der schamlos Fuchtel picheln. Die Hupfdohle erquicken das famos Schlachtschüssel. Prahlhans und Kittchen friemeln feist Fatzke. Die Aue gutheißen der pfundig Stümper. Gott zum Gruße!'.split(' ');
        words.concat(words);
        words.forEach((word) => {
            word += ' ' + (parseInt(Math.random() * 123, 10) + 1);
            document.querySelector(`#pl${now}list`).innerHTML += `
            <li data-word="${word.replace(/[\nx|\s]\d+/,'').toUpperCase()}" 
                data-points=${+word.match(/-?\d+/)}>
                ${word.toUpperCase()}
                <button>x</button>
            </li>`;
            now = (now === 1) ? 2 : 1;    
        })
        document.querySelector('.menu').style.display ='none';
        document.querySelector('.footer').style.visibility ='visible';
        players[0].status.innerText = '😒';
        players[1].status.innerText = '😁';
        game.name = 'newgame';
    }
    if (window.location.href.indexOf('debug') !== -1) { testfill(); }
    
    })();
    