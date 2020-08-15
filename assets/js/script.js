const elQuery = el => document.querySelector(el);
const elQueryAll = el => document.querySelectorAll(el);
const formatarMoeda = val => val.toFixed(2).toString().replace('.', ',');
let cart = [];
let pizzaQtd;
let pizzaKey;

// listagem de itens do modal
pizzaJson.map((item, index) => {
    let pizzaItem = elQuery('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = 'assets/' + item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${formatarMoeda(item.price)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', e => {
        e.preventDefault();
        pizzaKey = e.target.closest('.pizza-item').getAttribute('data-key');
        pizzaQtd = 1;

        elQuery('.pizzaBig img').src = 'assets/' + pizzaJson[pizzaKey].img;
        elQuery('.pizzaInfo h1').innerHTML = pizzaJson[pizzaKey].name;
        elQuery('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[pizzaKey].description;
        elQuery('.pizzaInfo .pizzaInfo--actualPrice').innerHTML = `R$ ${formatarMoeda(pizzaJson[pizzaKey].price)}`;
        elQuery('.pizzaInfo--size.selected').classList.remove('selected');
        elQueryAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex === 2) {
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[pizzaKey].sizes[sizeIndex];
        });
        
        elQuery('.pizzaInfo--qt').innerHTML = pizzaQtd;

        openModal();
    });
    
    elQuery('.pizza-area').append(pizzaItem);
});

// fechando modal
elQueryAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item, index) => {
    item.addEventListener('click', e => {
        closeModal();
    });
});

// selecionando tamanho
elQueryAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', e => {
        elQuery('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// diminuindo quantidade de pizzas
elQuery('.pizzaInfo--qtmenos').addEventListener('click', e => {
    if (pizzaQtd > 1) pizzaQtd--;
    elQuery('.pizzaInfo--qt').innerHTML = pizzaQtd;
});

// aumentando quantidade de pizzas
elQuery('.pizzaInfo--qtmais').addEventListener('click', e => {
    pizzaQtd++;
    elQuery('.pizzaInfo--qt').innerHTML = pizzaQtd;
});

// adicionando itens ao carrinho
elQuery('.pizzaInfo--addButton').addEventListener('click', e => {
    let pizzaTam = parseInt(elQuery('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[pizzaKey].id + '@' + pizzaTam;
    let key = cart.findIndex(item => item.identifier == identifier);
    
    if (key > -1) {
        cart[key].qnt += pizzaQtd;
    } else {
        cart.push({
            identifier : identifier,
            id  : pizzaJson[pizzaKey].id,
            size: pizzaTam,
            qnt : pizzaQtd
        });
    }
    updateCart();
    closeModal();
});

// função de abrir modal
function openModal() {
    elQuery('.pizzaWindowArea').style.opacity = 0;
    elQuery('.pizzaWindowArea').style.display = 'flex';

    setTimeout(e => {
        elQuery('.pizzaWindowArea').style.opacity = 1;
    }, 200);
}

// função de fechar modal
function closeModal() {
    elQuery('.pizzaWindowArea').style.opacity = 0;

    setTimeout(e => {        
        elQuery('.pizzaWindowArea').style.display = 'none';
    }, 200);
}

elQuery('.menu-openner').addEventListener('click', e => {
    if (cart.length > 0) elQuery('aside').style.left = 0;
});
elQuery('.menu-closer').addEventListener('click', e => {
    elQuery('aside').style.left = '100vw';
});

// função para atualizar o carrinho
function updateCart() {
    elQuery('.menu-openner span').innerHTML = cart.length;
    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    if (cart.length > 0) {
        elQuery('aside').classList.add('show');
        elQuery('.cart').innerHTML = '';
        
        cart.map((item, index) => {
            let pizzaItem = pizzaJson.find(data => data.id == item.id);
            let cartItem = elQuery('.cart--item').cloneNode(true);
            let pizzaSizeName;
            subtotal += pizzaItem.price * item.qnt;
            desconto = subtotal * 0.10;
            total = subtotal - desconto;
            
            switch (item.size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            cartItem.querySelector('img').src = 'assets/' + pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = item.qnt;
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', e => {
                item.qnt++;
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', e => {
                if (item.qnt > 1) {
                    item.qnt--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });

            elQuery('.cart').append(cartItem);
            
            elQuery('.subtotal span:last-child').innerHTML = `R$ ${formatarMoeda(subtotal)}`;
            elQuery('.desconto span:last-child').innerHTML = `R$ ${formatarMoeda(desconto)}`;
            elQuery('.total span:last-child').innerHTML = `R$ ${formatarMoeda(total)}`;
        });
    } else {
        elQuery('aside').classList.remove('show');
        elQuery('aside').style.left = '100vw';
    }
}