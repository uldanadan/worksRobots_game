const inputAmount: HTMLInputElement | null = document.querySelector('#inputAmount');
const btnAdd: HTMLButtonElement | null = document.querySelector('#btnAdd');
const list: HTMLDivElement | null = document.querySelector('#list');

interface IState {
    currentMood: string;
    raisePrice(product: Product): void;
    setUp(product: Product): void;
    setOff(product: Product): void;
    giveToTheWinner(product: Product): void;
}

class InStockState implements IState {
    currentMood: string;
    constructor() {
        this.currentMood = 'inStock';
    }
    raisePrice(product: Product): void {
        alert('The product is not yet bidding.');
    }
    setUp(product: Product): void {
        alert('Successful start of bidding for the product!');
        product.context.setState(new ForSaleState());
        console.log(`Product state is ${product.context.state?.currentMood}`);
    }
    giveToTheWinner(product: Product): void {
        alert('You can not give the product immediately from the warehouse.')
    }
    setOff(product: Product): void {
        alert('You can not withdraw from the auction a product that does not participate in them.');
    }
}

class ForSaleState implements IState {
    currentMood: string;
    constructor() {
        this.currentMood = 'forSale';
    }
    raisePrice(product: Product): void {
       product.price += 500;
       alert(`Successful price increase, product prise is ${product.price}`);
    }
    setUp(product: Product): void {
        alert('The product cannot be re-bid.')
    }
    giveToTheWinner(product: Product): void {
        if(product.price === 0) {
            alert("You can't give away the product for free.");
        } else {
            product.context.setState(new SoldState);
            product.honoraryCode = product.createHonoraryCode();
            console.log(`Product state is ${product.context.state?.currentMood}`);
        }
    }
    setOff(product: Product): void {
        product.context.setState(new InStockState);
        console.log(`Product state is ${product.state.currentMood}`);
    }
}

class SoldState implements IState {
    currentMood: string;
    constructor() {
        this.currentMood = 'sold';
    }
    raisePrice(product: Product): void {
        alert('The product is already sold.');
    }
    setUp(product: Product): void {
        alert('The product is already sold.');
    }
    giveToTheWinner(product: Product): void {    
        alert('The product is already sold.'); 
    }
    setOff(product: Product): void {
        alert("You can't withdraw from the auction the sold product.");
    }
}

class Context {
    state: IState | null = null;
    setState(state: IState): void {
        this.state = state;
    }
    raisePrice(product: Product): void {
        this.state?.raisePrice(product);
    }
    setUp(product: Product): void {
        this.state?.setUp(product);
    }
    giveToTheWinner(product: Product): void {    
        this.state?.giveToTheWinner(product);
    }
    setOff(product: Product): void {
        this.state?.setOff(product);
    }
}

class Product {
    id: string;
    name: string;
    price: number;
    honoraryCode: string;
    state: IState;
    context: Context = new Context;
    constructor(name: string) {
        this.name = name;
        this.id = MD5(this.name);
        this.price = 0;
        this.honoraryCode = '';
        this.state = new InStockState();
    }
    raisePrice(product: Product): void {
        this.context.raisePrice(this);
    }
    setUp(product: Product): void {
        this.context.setUp(this);
    }
    giveToTheWinner(): void {    
        this.context.giveToTheWinner(this);
    }
    setOff(product: Product): void {
        this.context.setOff(this);
    }
    createHonoraryCode = (): string => {
        let result: string = '';
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
    }
}

const buildProducts = (amount: number) => {
    const result: Product[] = [];
    const products: string[] = ['laptop', 'TV', 'bag', 'picture'];
    for (let i = 0; i < amount; i++) {
        result.push(new Product(
            products[Math.floor(Math.random() * products.length)]
        ))
    }
    return result;
}
const amount = parseInt(inputAmount!.value);
const products: Product[] = buildProducts(1);
const product = new Product(`${products}`);

const drawProducts = (products: Product[]): void => {
    list!.innerHTML = '';
    for (let i = 0; i < products.length; i++) {
        const produc: HTMLDivElement = document.createElement('div');
        const productName: HTMLParagraphElement = document.createElement('p');
        const productId: HTMLParagraphElement = document.createElement('p');
        const productPrice: HTMLParagraphElement = document.createElement('p');
        const productCode: HTMLParagraphElement = document.createElement('p');
        const productState: HTMLParagraphElement = document.createElement('p');
        const btnSetUp: HTMLButtonElement = document.createElement('button');
        const btnRaise: HTMLButtonElement = document.createElement('button');
        const btnGivWinner: HTMLButtonElement = document.createElement('button');
        const btnSetOff: HTMLButtonElement = document.createElement('button');

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
            product.state.setUp(product);
            productState.innerText = `State: ${product.context.state?.currentMood}`
        });
        btnRaise.addEventListener('click', () => {
            product.context.state?.raisePrice(product);
            productPrice.innerText = `Price: ${product.price}`
        });
        btnGivWinner.addEventListener('click', () => {
            product.state.giveToTheWinner(product);
                if (product.context.state?.currentMood === 'forSale') {
                    product.honoraryCode = product.createHonoraryCode();
                    console.log(products[i].state.currentMood)
                    productCode.innerText = `Honorary Code: ${product.honoraryCode}`;
                    productState.innerText = `State: ${product.state.currentMood}`;
                }
        });
        btnSetOff.addEventListener('click', () => {
            product.state.setOff(product);
            if (product.context.state?.currentMood === 'forSale') {
                productState.innerText = `State: ${product.context.state?.currentMood}`;
            }
        });

        produc.append(productName, productId, productPrice, productCode, productState, btnSetUp, btnRaise, btnGivWinner, btnSetOff);
        list?.append(produc);
    }
}

btnAdd?.addEventListener('click', () => {
    drawProducts(buildProducts(parseInt(inputAmount!.value)));
})