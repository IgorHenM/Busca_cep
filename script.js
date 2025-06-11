
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

        let formattedInfo =
         `
            <div class="sessaoInfo">
                <b>CEP:</b> ${infos.data.cep}
            </div>
            <div class="sessaoInfo">
                <b>LOGRADOURO:</b> ${infos.data.logradouro}
            </div>
            <div class="sessaoInfo">
                <b>COMPLEMENTO:</b> ${infos.data.complemento}
            </div>
            <div class="sessaoInfo">
                <b>BAIRRO:</b> ${infos.data.bairro}
            </div>
            <div class="sessaoInfo">
                <b>LOCALIDADE:</b> ${infos.data.localidade}
            </div>
            <div class="sessaoInfo">
                <b>UF:</b> ${infos.data.uf}
            </div>
            <div class="sessaoInfo">
                <b>ESTADO:</b> ${infos.data.estado}
            </div>
            <div class="sessaoInfo">
                <b>REGIÃO:</b> ${infos.data.regiao}
            </div>
            <div class="sessaoInfo">
                <b>DDD:</b> ${infos.data.ddd}
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


