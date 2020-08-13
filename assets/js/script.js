const elQuery = el => document.querySelector(el);
const elQueryAll = el => document.querySelectorAll(el);
const formatarMoeda = val => val.toFixed(2).toString().replace('.', ',');

pizzaJson.map((item, index) => {
    let pizzaItem = elQuery('.models .pizza-item').cloneNode(true);

    elQuery('.pizza-item--img img').src = 'assets/' + item.img;
    elQuery('.pizza-item--price').innerHTML = `R$ ${formatarMoeda(item.price)}`;
    elQuery('.pizza-item--name').innerHTML = item.name;
    elQuery('.pizza-item--desc').innerHTML = item.description;
    console.log(index);
    console.log(item.name);
    
    elQuery('.pizza-area').append(pizzaItem);
});
