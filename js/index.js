"use strict";
const inputAmount = document.querySelector('#inputAmount');
const btnAdd = document.querySelector('#btnAdd');
const list = document.querySelector('#list');
class InStockState {
    constructor() {
        this.currentMood = 'inStock';
    }
    raisePrice(product) {
        alert('The product is not yet bidding.');
    }
    setUp(product) {
        var _a;
        alert('Successful start of bidding for the product!');
        product.context.setState(new ForSaleState());
        console.log(`Product state is ${(_a = product.context.state) === null || _a === void 0 ? void 0 : _a.currentMood}`);
    }
    giveToTheWinner(product) {
        alert('You can not give the product immediately from the warehouse.');
    }
    setOff(product) {
        alert('You can not withdraw from the auction a product that does not participate in them.');
    }
}
class ForSaleState {
    constructor() {
        this.currentMood = 'forSale';
    }
    raisePrice(product) {
        product.price += 500;
        alert(`Successful price increase, product prise is ${product.price}`);
    }
    setUp(product) {
        alert('The product cannot be re-bid.');
    }
    giveToTheWinner(product) {
        var _a;
        if (product.price === 0) {
            alert("You can't give away the product for free.");
        }
        else {
            product.context.setState(new SoldState);
            product.honoraryCode = product.createHonoraryCode();
            console.log(`Product state is ${(_a = product.context.state) === null || _a === void 0 ? void 0 : _a.currentMood}`);
        }
    }
    setOff(product) {
        product.context.setState(new InStockState);
        console.log(`Product state is ${product.state.currentMood}`);
    }
}
class SoldState {
    constructor() {
        this.currentMood = 'sold';
    }
    raisePrice(product) {
        alert('The product is already sold.');
    }
    setUp(product) {
        alert('The product is already sold.');
    }
    giveToTheWinner(product) {
        alert('The product is already sold.');
    }
    setOff(product) {
        alert("You can't withdraw from the auction the sold product.");
    }
}
class Context {
    constructor() {
        this.state = null;
    }
    setState(state) {
        this.state = state;
    }
    raisePrice(product) {
        var _a;
        (_a = this.state) === null || _a === void 0 ? void 0 : _a.raisePrice(product);
    }
    setUp(product) {
        var _a;
        (_a = this.state) === null || _a === void 0 ? void 0 : _a.setUp(product);
    }
    giveToTheWinner(product) {
        var _a;
        (_a = this.state) === null || _a === void 0 ? void 0 : _a.giveToTheWinner(product);
    }
    setOff(product) {
        var _a;
        (_a = this.state) === null || _a === void 0 ? void 0 : _a.setOff(product);
    }
}
class Product {
    constructor(name) {
        this.context = new Context;
        this.createHonoraryCode = () => {
            let result = '';
            if (this.price >= 1000) {
                result += MD5("Gold-" + this.id);
            }
            else if (this.price >= 500 && this.price < 1000) {
                result += MD5("Silver-" + this.id);
            }
            else if (this.price < 500) {
                result += MD5("Bronze-" + this.id);
            }
            return result;
        };
        this.name = name;
        this.id = MD5(this.name);
        this.price = 0;
        this.honoraryCode = '';
        this.state = new InStockState();
    }
    raisePrice(product) {
        this.context.raisePrice(this);
    }
    setUp(product) {
        this.context.setUp(this);
    }
    giveToTheWinner() {
        this.context.giveToTheWinner(this);
    }
    setOff(product) {
        this.context.setOff(this);
    }
}
const buildProducts = (amount) => {
    const result = [];
    const products = ['laptop', 'TV', 'bag', 'picture'];
    for (let i = 0; i < amount; i++) {
        result.push(new Product(products[Math.floor(Math.random() * products.length)]));
    }
    return result;
};
const amount = parseInt(inputAmount.value);
const products = buildProducts(1);
const product = new Product(`${products}`);
const drawProducts = (products) => {
    list.innerHTML = '';
    for (let i = 0; i < products.length; i++) {
        const produc = document.createElement('div');
        const productName = document.createElement('p');
        const productId = document.createElement('p');
        const productPrice = document.createElement('p');
        const productCode = document.createElement('p');
        const productState = document.createElement('p');
        const btnSetUp = document.createElement('button');
        const btnRaise = document.createElement('button');
        const btnGivWinner = document.createElement('button');
        const btnSetOff = document.createElement('button');
        productName.innerText = `Name: ${products[i].name}`;
        productId.innerText = `ID: ${products[i].id}`;
        productPrice.innerText = `Pruce: ${products[i].price}`;
        productCode.innerText = `Honorary Code: ${products[i].honoraryCode}`;
        productState.innerText = `State: ${products[i].state.currentMood}`;
        btnSetUp.innerText = 'Set Up';
        btnRaise.innerText = 'Raise price';
        btnGivWinner.innerText = 'Giv Winner';
        btnSetOff.innerText = 'Set Off';
        btnSetUp.addEventListener('click', () => {
            var _a;
            product.state.setUp(product);
            productState.innerText = `State: ${(_a = product.context.state) === null || _a === void 0 ? void 0 : _a.currentMood}`;
        });
        btnRaise.addEventListener('click', () => {
            var _a;
            (_a = product.context.state) === null || _a === void 0 ? void 0 : _a.raisePrice(product);
            productPrice.innerText = `Price: ${product.price}`;
        });
        btnGivWinner.addEventListener('click', () => {
            var _a;
            product.state.giveToTheWinner(product);
            if (((_a = product.context.state) === null || _a === void 0 ? void 0 : _a.currentMood) === 'forSale') {
                product.honoraryCode = product.createHonoraryCode();
                console.log(products[i].state.currentMood);
                productCode.innerText = `Honorary Code: ${product.honoraryCode}`;
                productState.innerText = `State: ${product.state.currentMood}`;
            }
        });
        btnSetOff.addEventListener('click', () => {
            var _a, _b;
            product.state.setOff(product);
            if (((_a = product.context.state) === null || _a === void 0 ? void 0 : _a.currentMood) === 'forSale') {
                productState.innerText = `State: ${(_b = product.context.state) === null || _b === void 0 ? void 0 : _b.currentMood}`;
            }
        });
        produc.append(productName, productId, productPrice, productCode, productState, btnSetUp, btnRaise, btnGivWinner, btnSetOff);
        list === null || list === void 0 ? void 0 : list.append(produc);
    }
};
btnAdd === null || btnAdd === void 0 ? void 0 : btnAdd.addEventListener('click', () => {
    drawProducts(buildProducts(parseInt(inputAmount.value)));
})