inputName = document.querySelector('.input-name-player')
button = document.querySelector('.create-player')
form = document.querySelector('.players')
button_save = document.querySelector('.config-save')
button_exclude_cards = document.querySelector('.exclude-cards')
button_reset = document.querySelector('.config-reset')
valor_limite = document.querySelector('#select-limite-choop')
valor_chopp = document.querySelector('#input-value-chopp')
checkbox_element = document.querySelector('#id-check-modal')


limite = localStorage.getItem('config-limite')
if (limite == null) {
    limite = 5
    localStorage.setItem('config-limite', limite)
} else limite = parseInt(localStorage.getItem('config-limite'))


value_chopp = localStorage.getItem('config-value_chopp')
if (value_chopp == null) {
    value_chopp = 7.00
    localStorage.setItem('config-value_chopp', value_chopp)
} else value_chopp = parseFloat(localStorage.getItem('config-value_chopp'))


arrNames = localStorage.getItem('array-players')
if (arrNames == null) {
    
    arrNames = []
    localStorage.setItem('array-players', JSON.stringify(arrNames))
}else arrNames = JSON.parse(localStorage.getItem('array-players'))


arrCards = localStorage.getItem('array-cards')
if (arrCards == null) {

    arrCards = []
    localStorage.setItem('array-cards', JSON.stringify(arrCards))
} else arrCards = JSON.parse(localStorage.getItem('array-cards'))




Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};



const removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}

passed = false
select_empty = false
input_empty = false
valor_limite.value = limite
valor_chopp.value = floatToString(value_chopp) // .replace('.', ',')

for (arr_card of arrCards) {
    html_card = arr_card['html']
    form.insertAdjacentHTML('beforeend', html_card)
}


// ---------------------------------------------------------------------------------------------------
const validateInput = ({ target }) => {

    if (target.value.length > 2 && target.value.length <= 25 && arrNames.includes(target.value) == false) {
        button.removeAttribute('disabled');
        return;
    }

    button.setAttribute('disabled', '');
}

// ---------------------------------------------------------------------------------------------------

const handleSubmit = (event) => {
    event.preventDefault();
    nome = inputName.value
    // name_class = nome.replaceAll(' ', '-')
    name_class = nome.replace(/ /g, '-')

    html = `<div class="card">
    <div class="conteiner-principal">
        <div class="container-name">
            <div class="plus-chopp ${nome}">
                <h1>${nome}</h1>
            </div>
            <div onclick="handleIncrementar(this); "class="plus-botton ${name_class}">
            </div>
        </div>
        <div class="conteiner-count">
            <div class="name-count">
                <h1>Quantidade</h1>
            </div>
            <div class="value-count ${name_class}">0</div>
        </div>

        <div class="conteiner-total">
            <div class="name-total">Total</div>
            <div class="value-total ${name_class}">R$ 0,00</div>
        </div>
        <button  onclick="handleExcluir(this);" class="button-delete ${name_class}">Excluir</button>
    </div>
</div>`

    
    form.insertAdjacentHTML('beforeend', html)
    arrNames.push(name_class)
    localStorage.setItem('array-players', JSON.stringify(arrNames))
    obj = {name_class, html}
    arrCards.push(obj)
    localStorage.setItem('array-cards', JSON.stringify(arrCards))

    inputName.value = ""
    button.setAttribute('disabled', '');

}
// ---------------------------------------------------------------------------------------------------

function floatToString(num) {
    return num.toFixed(Math.max(2, num.toString().substr(num.toString().indexOf(",")).length));
}
// ---------------------------------------------------------------------------------------------------

function incrementar() {
    if (parseInt(contador.innerText) < limite) {
        contador.innerHTML = parseInt(contador.innerText) + 1;
        contador.style.backgroundColor = '#009000'
        valorTotal = parseFloat(total.innerText.slice(3)) + value_chopp
        valorTotal = floatToString(valorTotal)
        valorTotal = `R$ ${valorTotal}`
        total.innerHTML = valorTotal
        total.style.backgroundColor = '#3069b3'
    }

    if (parseInt(contador.innerText) == limite) {
        contador.style.backgroundColor = '#ff0000'
        total.style.backgroundColor = '#ff0000'

        if (passed == false) {
            passed = true
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Ops...',
                text: 'Parece que você bebeu um pouco além da conta... Vamos parando por aqui.'
            })
        }
    }


}
// ---------------------------------------------------------------------------------------------------
const handleIncrementar = (target) => {
    nome_target = target.className.slice(12)
    
    contador = document.querySelector(`.value-count.${nome_target}`)
    total = document.querySelector(`.value-total.${nome_target}`)
    incrementar()
    
    card_pai = contador.parentElement.parentElement.parentElement
    new_html_card = card_pai.outerHTML
    
    objIndex = arrCards.findIndex((obj => obj.name_class == nome_target));
    arrCards[objIndex].html = new_html_card
    localStorage.setItem('array-cards', JSON.stringify(arrCards))
}
// ---------------------------------------------------------------------------------------------------

const handleExcluir = (target) => {
    nome_target = target.className.slice(14)
    document.querySelector(`.button-delete.${nome_target}`).parentElement.parentElement.remove()
    arrNames.remove(nome_target)
    localStorage.setItem('array-players', JSON.stringify(arrNames))
    arrCards = removeByAttr(arrCards, 'name_class', nome_target)
    localStorage.setItem('array-cards', JSON.stringify(arrCards))

}
// ---------------------------------------------------------------------------------------------------
const ExcludesCards = (event) => {
    event.preventDefault();
    cards = document.querySelectorAll('.card')
    for(card of cards) {
        name_id = card.childNodes[1].childNodes[1].childNodes[1].className.slice(11)
        card.remove()
        arrNames.remove(name_id)
        localStorage.setItem('array-players', JSON.stringify(arrNames))

        arrCards = removeByAttr(arrCards, 'name_class', name_id)
        localStorage.setItem('array-cards', JSON.stringify(arrCards))
        
    }
    checkbox_element.checked = false
    valor_limite.value = limite
    valor_chopp.value = floatToString(value_chopp) //.replace('.', ',')
    button_save.setAttribute('disabled', '');
    Swal.fire(
        'Sucesso!',
        'Todos os Cards foram excluidos com sucesso :)',
        'success'
      )

    
}
// ---------------------------------------------------------------------------------------------------
const saveConfig = (event) => {
    event.preventDefault();

        limite = parseInt(valor_limite.value)
        value_chopp = parseFloat(valor_chopp.value)
        localStorage.setItem('config-limite', limite)
        localStorage.setItem('config-value_chopp', value_chopp)
        
        checkbox_element.checked = false
        Swal.fire(
            'Sucesso!',
            'Preferencias salvas com sucesso :)',
            'success'
          )
        button_save.setAttribute('disabled', '');
}
// ---------------------------------------------------------------------------------------------------
const resetConfig = (event) => {
    event.preventDefault();

    limite = 5
    value_chopp = 7.00

    localStorage.setItem('config-limite', limite)
    localStorage.setItem('config-value_chopp', value_chopp)
    
    valor_limite.value = limite
    valor_chopp.value = floatToString(value_chopp) //.replace('.', ',')

    checkbox_element.checked = false
    Swal.fire(
        'Sucesso!',
        'Preferencias originais aplicadas com sucesso :)',
        'success'
        )
    button_save.setAttribute('disabled', '');
}

// ---------------------------------------------------------------------------------------------------

const validateSelect = ({ target }) => {
    number_cards = document.querySelectorAll('.card').length
    if (target.value != '' && number_cards == 0) {
    // if (target.value != '') {
        select_empty = false
        if (input_empty == false) button_save.removeAttribute('disabled')
    } else {
        select_empty = true
        button_save.setAttribute('disabled', '');
    }
    
}

// ---------------------------------------------------------------------------------------------------

const validateInputValue = ({ target }) => {
    number_cards = document.querySelectorAll('.card').length
    if (target.value != '' && target.value != '0' && parseInt(target.value) < 101 && number_cards == 0) {
    // if (target.value != '' && target.value != '0' && parseInt(target.value) < 101) {
        input_empty = false
        if (select_empty == false) button_save.removeAttribute('disabled')
    } else {
        input_empty = true
        button_save.setAttribute('disabled', '');
    }
}

// ---------------------------------------------------------------------------------------------------
const disabledButtonExclude = () => {
    number_cards = document.querySelectorAll('.card').length
    adds = document.querySelectorAll('.plus-botton')


    if (checkbox_element.checked == true) {

        for (add of adds){
            add.hidden = true
        }

        if (number_cards > 0) {
            button_exclude_cards.removeAttribute('disabled');
            button_reset.setAttribute('disabled', '');
            return;
        }

        button_exclude_cards.setAttribute('disabled', '');
        button_reset.removeAttribute('disabled');
    }
    for (add of adds){
        add.hidden = false
    }
}

// ---------------------------------------------------------------------------------------------------

inputName.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);
button_exclude_cards.addEventListener('click', ExcludesCards)
button_save.addEventListener('click', saveConfig)
button_reset.addEventListener('click', resetConfig)
valor_limite.addEventListener('change', validateSelect)
valor_chopp.addEventListener('input', validateInputValue)
checkbox_element.addEventListener('change', disabledButtonExclude)