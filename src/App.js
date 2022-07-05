import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './webfontkit-minecraft/stylesheet.css';
import InventoryOption from './components/InventoryOption.js';

// Notes
// https://external-preview.redd.it/V1HxsK_jgrLcny1PqjkhIGrDJCCUYPmNQoGs_V6LbZw.png
// https://docs.google.com/spreadsheets/d/1DFjuC72SqkMAb0ZFk89Q8H_ifVY-sa0-37GUDM7SYqU/edit#gid=69539100

import sellOptions from './data/selldata.json';
import buyOptions from './data/buydata.json';

let uniqueAvailableItems = [...new Set(
    sellOptions.data.map(
      item => item.label
    )
  )].sort((a, b) => -b.localeCompare(a));

let uniqueWishlistItems = [...new Set(
    buyOptions.data.map(
      item => item.label
    )
  )].sort((a, b) => -b.localeCompare(a));

class App extends React.Component {

  state = {
    inventoryItems : [{id:0,item:"iron",count:20,buyCount:"4"}], //minSellCount
    wishListItems : [ {id:0,item:"apple",count:4,affordable:false,buyCount:"4"},//buyCount
                      {id:1,item:"bread",count:6,affordable:false,buyCount:"6"},
                      {id:2,item:"name tag",count:1,affordable:false,buyCount:"1"}],
    inputValue : "",
    inputLabel : "",
    inputIndex : 0,
    inputCount : 0,
    emeraldValue : 0,
    remainingBudget : 0
  }

  updateValues(){

    console.log("------------------------");
    console.log("inventoryItems from stack");
    console.log(this.state.inventoryItems);
  
    console.log("wishListItems from stack");
    console.log(this.state.wishListItems);
    console.log("------------------------");
  
    let calcValue = 0;

    for(let key in this.state.inventoryItems){
      let obj = this.state.inventoryItems[key];
      if(this.getBestTrade(obj)){
        calcValue += this.getBestTrade(obj,"sell");
      }
    }

    this.setState({
      emeraldValue: calcValue
    });

    this.reviewPurchases(calcValue);
    this.forceUpdate();
  }

  reviewPurchases(budget){

    let wishList = this.state.wishListItems;

    for(let key in wishList){
      let obj = wishList[key];

      let cost = this.getBestTrade(obj,"buy");
      //console.log(obj);
      //console.log("best trade is:"+ cost);
      
      if(cost<=budget){
        wishList[key].affordable = true;
      } else {
        wishList[key].affordable = false;
      }
      budget -= cost;

      this.setState({
        wishListItems: wishList,
        remainingBudget: budget
      });
    }
  }

  getBestTrade(obj,type){

    let data = (type==="buy")? buyOptions.data : sellOptions.data;
    //console.log(obj);
    for(let key in data){
      if(type==="buy"){
        let sellOption = data[key];
        if(sellOption.label===obj.item){
          return  Math.floor(obj.count/sellOption.buyCount)*sellOption.minSellCount;
        }
      } else {
        let sellOption = data[key];
        if(sellOption.label===obj.item){
          return Math.floor(obj.count/sellOption.minSellCount)*sellOption.buyCount;
        }
      }
    }
  }

  handleCountChange = (event) => {
    this.setState({
      inputCount:event.target.value
    }, () => {
      this.updateValues();
    });
  }
  
  handleInventoryChange = (choice) => {
    this.setState({
      inventoryItems: this.addRemoveStack(choice.id, this.state.inventoryItems, choice, "change","inv")
    }, () => {
      this.updateValues();
    });
  }

  handleWishListChange = (choice) => {
    this.setState({
      wishListItems: this.addRemoveStack(choice.id, this.state.wishListItems, choice, "change","wish")
    }, () => {
      this.updateValues();
    });
  }

  handleAddRemoveItem = (id) => {
    let obj = {id:0,item:"",count:0};
    //console.log("Inv ID:"+id);
    this.setState({
      inventoryItems:this.addRemoveStack(id,this.state.inventoryItems,obj, "remove","inv")
    }, () => {
      this.updateValues();
    });
  }

  handleAddRemoveWish = (id) => {
    let obj = {id:0,item:"",count:0,buyCount:1};
    //console.log("Wish ID:"+id);
    this.setState({
      wishListItems:this.addRemoveStack(id,this.state.wishListItems,obj, "remove","wish")
    }, () => {
      this.updateValues();
    });
  }

  addRemoveStack = (id, stack, obj, type,category) => {
    if(id<0){
      stack.push(obj);
    } else if (type==="remove"){
      stack.splice(id,1);
    } else {
      obj = this.correctStepCount(obj,category);
      stack.splice(id,1,obj);
    }
    return stack;
  }

  correctStepCount = (obj,category) => {
    let data = (category==="wish")? buyOptions.data : sellOptions.data;
    for(let key in data){
      if(data[key].label===obj.item){
        if(category==="wish"){
          obj.buyCount = data[key].buyCount;
        }else{
          obj.buyCount = data[key].minSellCount;
        }
        console.log("Setting new obj.buyCount:"+obj.buyCount);
        return obj;
      }
    }
    return obj;
  }

  render(){
    
    return (
      <div className="wrapper">
        <header>
          <h1>Villager Trade Calculator</h1>
        </header>
        <div className="row content">
          <div className="col-5">
            <h4>Buy / Sell</h4>

             {Object.entries(this.state.inventoryItems).map(([key, value], index) => {
                return (
                  <InventoryOption 
                      key={index} id={index} behavior="inventory"
                      item={this.state.inventoryItems[key].item}
                      count={this.state.inventoryItems[key].count}
                      lastItem={index>=this.state.inventoryItems.length-1}
                      handleAddRemove={this.handleAddRemoveItem} 
                      handleChange={this.handleInventoryChange} 
                      options={uniqueAvailableItems}
                      affordable={this.state.wishListItems[key].affordable}
                      buyCount={this.state.wishListItems[key].buyCount} />
                )})}
            
          </div>
          <div className="col-2">
              <h4>Value in Emeralds</h4>
              <div className="emValue"><span>x</span>{this.state.emeraldValue}</div>
              <h4>Remaining budget in Emeralds</h4>
              <div className="emValue remaining"  style={{
                            color: this.state.remainingBudget < 0 ? "red" : "green"
                          }}>{this.state.remainingBudget}</div>
          </div>
          <div className="col-5">            
            <h4>Wish List</h4>

             {Object.entries(this.state.wishListItems).map(([key, value], index) => {
                return (
                  <InventoryOption 
                  key={index} id={index} behavior="wish"
                  item={this.state.wishListItems[key].item}
                  count={this.state.wishListItems[key].count}
                  lastItem={index>=this.state.wishListItems.length-1}
                  handleAddRemove={this.handleAddRemoveWish} 
                  handleChange={this.handleWishListChange} 
                  options={uniqueWishlistItems} 
                  affordable={this.state.wishListItems[key].affordable}
                  buyCount={this.state.wishListItems[key].buyCount} />
                )})}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount = (prevProps) => {
    this.updateValues();
  }
}
export default App;