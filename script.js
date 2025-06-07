
var isOpenedModal = false;//inverter
var cnaeInfo = [];

window.onkeydown = (event) => {
    if (event.keyCode === 13) {
        if (getInputCEP().value.length === 14) {
            searchCep();
        }
    }
}


async function searchCep() {
    let infosField = document.getElementById("info");

    infosField.style.display = "flex";

    if (getCep()) {
        let infos = await getInformation(getCep());//retorno da API
        console.log(infos)

        cnaeInfo = infos.data.cnaes_secundarios;

        let formattedInfo = `
        <div class="sessaoInfo">
            <b>CNPJ:</b> ${infos.data.cnpj}
        </div>
        <div class="sessaoInfo">
            <b>RAZÃO SOCIAL:</b> ${infos.data.razao_social}
        </div>
        <div class="sessaoInfo">
            <b>CAPITAL SOCIAL:</b> ${formatBRL(infos.data.capital_social)}
        </div>
        <div class="sessaoInfo">
            <b>TELEFONE 1:</b> ${infos.data.ddd_telefone_1}
        </div>
        <div class="sessaoInfo">
            <b>TELEFONE 2:</b> ${formatNoValue(infos.data.ddd_telefone_2)}
        </div>
        <div class="sessaoInfo">
            <b>OPÇÃO PELO MEI:</b> ${formatNoValue(infos.data.opcao_pelo_mei)}
        </div>
        <div class="sessaoInfo">
            <b>CNAEs:</b> <a href="#" onclick="showDetailCnae()"> Mais informações</a>
        </div>
        `

        infosField.innerHTML = formattedInfo;
    }
}

function getCep() {
    const cep = getInputCEP();
    return cep.value;
}

function getInputCEP() {
    return document.getElementById("cep_id");//DOM = Document Object Model 
}

async function getInformation(cep) {
    return await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
}


function formatNoValue(value) {
    if (!value) {
        return 'Sem Informação'
    }

    return value === true ? 'Sim' : value;
}


