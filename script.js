// ======================================
// COMUNIDADE DA MEMÓRIA PERDIDA
// JAVASCRIPT
// ======================================

// DADOS DAS 12 REGIÕES

const R = [
    [
        "Região Costeira Norte",
        "Litoral",
        "Área costeira ao norte, com comunidades próximas ao mar.",
        "Pesca, turismo e preservação ambiental.",
        "Praias e enseadas."
    ],
    [
        "Região Costeira Sul",
        "Litoral",
        "Faixa litorânea ao sul, marcada por áreas portuárias.",
        "Portos, pesca e atividades marítimas.",
        "Porto marítimo e cais."
    ],
    [
        "Planícies Centrais Norte",
        "Planície",
        "Região de transição entre litoral e centro urbano.",
        "Comércio, serviços e agricultura.",
        "Centro administrativo."
    ],
    [
        "Planícies Centrais Sul",
        "Planície",
        "Área de planícies ao sul, com cursos d'água e espaços produtivos.",
        "Agricultura e abastecimento.",
        "Áreas agrícolas."
    ],
    [
        "Região dos Lagos Interiores",
        "Interior",
        "Conjunto de lagos e áreas de água doce.",
        "Pesca, lazer e turismo.",
        "Lagos e comunidades ribeirinhas."
    ],
    [
        "Delta Fluvial Sul",
        "Fluvial",
        "Região de rios e canais com áreas de várzea.",
        "Navegação, pesca e preservação.",
        "Rios e margens."
    ],
    [
        "Encostas Montanhosas Centrais",
        "Montanhosa",
        "Área de relevo elevado próxima ao centro.",
        "Turismo, pesquisa e conservação.",
        "Observatório e trilhas."
    ],
    [
        "Cadeia Montanhosa Norte",
        "Montanhosa",
        "Região de montanhas ao norte e áreas de altitude.",
        "Pesquisa e turismo de natureza.",
        "Base de pesquisa."
    ],
    [
        "Cadeia Montanhosa Sul",
        "Montanhosa",
        "Área de montanhas ao sul e pontos de monitoramento.",
        "Monitoramento ambiental e pesquisa.",
        "Estação de monitoramento."
    ],
    [
        "Região Avermelhada Mineralizada",
        "Mineral",
        "Área de solo avermelhado com formações minerais.",
        "Mineração e monitoramento ambiental.",
        "Complexo de mineração."
    ],
    [
        "Vales Fluviais Orientais",
        "Fluvial",
        "Vales atravessados por rios e áreas de relevo suave.",
        "Energia, agricultura e preservação.",
        "Usina hidrelétrica."
    ],
    [
        "Região Florestal Sul",
        "Florestal",
        "Área de cobertura vegetal densa e importância ambiental.",
        "Preservação, pesquisa e turismo ecológico.",
        "Centro de preservação."
    ]
];


// ======================================
// FUNÇÕES DE APOIO
// ======================================

const $ = (seletor) => document.querySelector(seletor);

const $$ = (seletor) =>
    [...document.querySelectorAll(seletor)];

function all() {
    return JSON.parse(
        localStorage.getItem("cmp_memories") || "[]"
    );
}

function users() {
    return JSON.parse(
        localStorage.getItem("cmp_users") || "[]"
    );
}

let me = null;


// ======================================
// TROCAR ENTRE LOGIN E CADASTRO
// ======================================

function tab(tipo) {

    $("#login").classList.toggle(
        "hide",
        tipo !== "login"
    );

    $("#register").classList.toggle(
        "hide",
        tipo !== "register"
    );

    $$(".tabs button").forEach(botao => {

        botao.classList.toggle(
            "active",
            botao.dataset.tab === tipo
        );

    });

    $("#authmsg").textContent = "";
}

$$("[data-tab]").forEach(botao => {

    botao.onclick = () => {
        tab(botao.dataset.tab);
    };

});


// ======================================
// CADASTRAR MORADOR
// ======================================

$("#register").onsubmit = function(evento) {

    evento.preventDefault();

    const name = $("#rn").value.trim();

    const email = $("#re").value.trim().toLowerCase();

    const password = $("#rp").value;

    const confirm = $("#rc").value;

    const birth = $("#rb").value;

    if (password !== confirm) {

        $("#authmsg").textContent =
            "As senhas não coincidem.";

        return;
    }

    const lista = users();

    const existe = lista.some(usuario =>
        usuario.email === email
    );

    if (existe) {

        $("#authmsg").textContent =
            "Este e-mail já está cadastrado.";

        return;
    }

    lista.push({
        name,
        email,
        password,
        birth
    });

    localStorage.setItem(
        "cmp_users",
        JSON.stringify(lista)
    );

    $("#authmsg").textContent =
        "Cadastro realizado com sucesso! Agora entre com seus dados.";

    $("#le").value = email;

    $("#register").reset();

    tab("login");
};


// ======================================
// ENTRAR NO SISTEMA
// ======================================

$("#login").onsubmit = function(evento) {

    evento.preventDefault();

    const email = $("#le").value.trim().toLowerCase();

    const password = $("#lp").value;

    me = users().find(usuario =>
        usuario.email === email &&
        usuario.password === password
    );

    if (!me) {

        $("#authmsg").textContent =
            "E-mail ou senha incorretos.";

        return;
    }

    start();
};


// ======================================
// ABRIR PAINEL PRINCIPAL
// ======================================

function start() {

    $("#auth").classList.add("hide");

    $("#app").classList.remove("hide");

    $("#hello").textContent =
        me.name.split(" ")[0];

    $("#sideName").textContent = me.name;

    $("#initial").textContent =
        me.name[0].toUpperCase();

    $("#walletinitial").textContent =
        me.name[0].toUpperCase();

    $("#walletname").textContent = me.name;

    $("#wallemail").textContent = me.email;

    $("#ma").value = me.name;

    $("#date").textContent =
        new Date().toLocaleDateString(
            "pt-BR",
            { dateStyle: "full" }
        );

    fillRegions();

    render();

    go("home");
}


// ======================================
// SAIR DA CONTA
// ======================================

$("#logout").onclick = function() {

    me = null;

    $("#app").classList.add("hide");

    $("#auth").classList.remove("hide");

    $("#login").reset();

    tab("login");
};


// ======================================
// NAVEGAÇÃO ENTRE AS TELAS
// ======================================

function go(id) {

    $$(".page").forEach(pagina => {

        pagina.classList.add("hide");

    });

    $("#" + id).classList.remove("hide");

    const titulos = {

        home: "Painel principal",

        maps: "Mapas da comunidade",

        new: "Registrar memória",

        archive: "Arquivo comunitário",

        council: "Conselho comunitário",

        wallet: "Carteira do morador"

    };

    $("#heading").textContent = titulos[id];

    if (id === "archive") {
        render();
    }
}


// BOTÕES DO MENU E DO PAINEL

document.addEventListener("click", evento => {

    const botao = evento.target.closest("[data-page]");

    if (botao) {

        go(botao.dataset.page);

    }

});


// ======================================
// PREENCHER REGIÕES NOS SELECTS
// ======================================

function fillRegions() {

    R.forEach((regiao, indice) => {

        const numero = indice + 1;

        const nome =
            `Região ${numero} — ${regiao[0]}`;

        $("#mr").add(
            new Option(nome, numero)
        );

        $("#filter").add(
            new Option(nome, numero)
        );

        $("#regiongrid").insertAdjacentHTML(
            "beforeend",

            `<button data-region="${numero}">
                <b>${numero}</b>　${regiao[0]}
            </button>`
        );

    });

}


// ======================================
// SELECIONAR REGIÃO NO MAPA
// ======================================

function choose(numero) {

    const regiao = R[numero - 1];

    if (!regiao) return;

    // Destacar região no mapa

    $$("polygon").forEach(poligono => {

        poligono.classList.toggle(
            "selected",
            Number(poligono.dataset.r) === numero
        );

    });

    // Destacar botão da região

    $$("[data-region]").forEach(botao => {

        botao.classList.toggle(
            "active",
            Number(botao.dataset.region) === numero
        );

    });

    // Mostrar informações

    $("#details").innerHTML = `

        <small>REGIÃO SELECIONADA</small>

        <div class="big">${numero}</div>

        <h2>Região ${numero}</h2>

        <b>${regiao[0]}</b>

        <p>${regiao[1]}</p>

        <p>${regiao[2]}</p>

        <p>
            <b>Atividades:</b>
            ${regiao[3]}
        </p>

        <p>
            <b>Locais de referência:</b>
            ${regiao[4]}
        </p>

        <button class="btn" id="regionmem">
            Ver memórias desta região
        </button>

    `;

    // Abrir arquivo filtrado pela região

    $("#regionmem").onclick = function() {

        go("archive");

        $("#filter").value = numero;

        render();

    };

}


// CLIQUE NAS ÁREAS DO MAPA

$$("polygon").forEach(poligono => {

    poligono.onclick = function() {

        choose(Number(this.dataset.r));

    };

});


// CLIQUE NOS BOTÕES DAS REGIÕES

$("#regiongrid").onclick = function(evento) {

    const botao = evento.target.closest("[data-region]");

    if (botao) {

        choose(Number(botao.dataset.region));

    }

};


// ======================================
// REGISTRAR NOVA MEMÓRIA
// ======================================

$("#memoryform").onsubmit = function(evento) {

    evento.preventDefault();

    const arquivo = $("#mf").files[0];

    // Limite de 5 MB

    if (arquivo && arquivo.size > 5 * 1024 * 1024) {

        $("#memmsg").textContent =
            "O arquivo deve ter até 5 MB.";

        return;
    }

    const lista = all();

    const memoria = {

        title: $("#mt").value.trim(),

        author: $("#ma").value.trim(),

        date: $("#md").value,

        region: Number($("#mr").value),

        place: $("#mp").value.trim(),

        story: $("#ms").value.trim(),

        file: arquivo ? arquivo.name : ""

    };

    lista.unshift(memoria);

    localStorage.setItem(
        "cmp_memories",
        JSON.stringify(lista)
    );

    $("#memoryform").reset();

    $("#ma").value = me.name;

    $("#memmsg").textContent =
        "Memória salva com sucesso!";

    render();

    setTimeout(() => {

        go("archive");

    }, 700);

};


// ======================================
// PROTEGER TEXTO EXIBIDO NA TELA
// ======================================

function safe(texto) {

    return String(texto).replace(
        /[&<>"']/g,

        caractere => ({

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#39;"

        })[caractere]

    );

}


// ======================================
// MOSTRAR MEMÓRIAS NO SITE
// ======================================

function render() {

    const lista = all();

    $("#count").textContent = lista.length;

    // Criar cartões de memórias

    const html = lista.map(memoria => {

        const nomeRegiao =
            R[memoria.region - 1]?.[0] || "Não informada";

        const data = memoria.date
            ? new Date(memoria.date + "T12:00:00")
                .toLocaleDateString("pt-BR")
            : "";

        return `

            <article class="memory">

                <h4>${safe(memoria.title)}</h4>

                <p>${safe(memoria.story.slice(0, 250))}</p>

                <div class="meta">

                    ${safe(memoria.author)}

                    · ${data}

                    · Região ${memoria.region}

                    — ${safe(nomeRegiao)}

                    ${memoria.place
                        ? " · " + safe(memoria.place)
                        : ""}

                    ${memoria.file
                        ? " · Anexo: " + safe(memoria.file)
                        : ""}

                </div>

            </article>

        `;

    });

    // Últimas três memórias

    $("#recent").innerHTML =

        html.slice(0, 3).join("") ||

        '<p class="card">Ainda não há memórias registradas. Compartilhe a primeira!</p>';


    // PESQUISA E FILTRO

    const termo =
        ($("#search")?.value || "").toLowerCase();

    const regiao =
        $("#filter")?.value || "";

    const filtradas = lista.filter(memoria => {

        const correspondeRegiao =
            !regiao ||
            String(memoria.region) === regiao;

        const texto = [

            memoria.title,

            memoria.story,

            memoria.author,

            memoria.place

        ].join(" ").toLowerCase();

        const correspondePesquisa =
            texto.includes(termo);

        return correspondeRegiao && correspondePesquisa;

    });

    // Exibir resultados filtrados

    const resultados = filtradas.map(memoria => {

        const nomeRegiao =
            R[memoria.region - 1]?.[0] || "Não informada";

        const data = memoria.date
            ? new Date(memoria.date + "T12:00:00")
                .toLocaleDateString("pt-BR")
            : "";

        return `

            <article class="memory">

                <h4>${safe(memoria.title)}</h4>

                <p>${safe(memoria.story)}</p>

                <div class="meta">

                    Autor: ${safe(memoria.author)}

                    · Data: ${data}

                    · Região ${memoria.region}

                    — ${safe(nomeRegiao)}

                    ${memoria.place
                        ? " · Local: " + safe(memoria.place)
                        : ""}

                    ${memoria.file
                        ? " · Anexo: " + safe(memoria.file)
                        : ""}

                </div>

            </article>

        `;

    });

    $("#allmem").innerHTML =

        resultados.join("") ||

        '<p class="card">Nenhuma memória encontrada.</p>';

}


// ======================================
// PESQUISAR MEMÓRIAS
// ======================================

$("#search").oninput = function() {

    render();

};


// FILTRAR POR REGIÃO

$("#filter").onchange = function() {

    render();

};