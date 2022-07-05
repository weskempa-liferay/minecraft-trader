import React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

class InventoryOption extends React.Component {

  state = {
    id : this.props.id,
    count : this.props.count,
    item : this.props.item,
    buyCount : this.props.buyCount
  }

  updateInventory = (addRemove) => {
    if(addRemove>0){
      this.props.handleAddRemove(-1)
    }else{
      let id = this.props.id;
      this.props.handleAddRemove(id);
    }
  }

  updateItem  = (newValue) => {
    this.setState({
      item: newValue
    }, () => {
      this.updateValues();
    });
  }

  updateCount  = (event) => {
    this.setState({
      count: event.target.value
    }, () => {
      this.updateValues();
    });
    this.forceUpdate();
  }

  updateValues  = () => {
    this.props.handleChange( this.state );
  }

  render() {

    return <FormControl fullWidth className="InventoryOption">
        <div className="row">
          <div className="col-1">
            <Button variant="disabled" className="check"
                style={{ display: (this.props.behavior==="wish" 
                  && this.props.affordable ? 'block' : 'none') }}
                >&#10004;</Button>

                <Button variant="disabled" className="check red"
                    style={{ display: (this.props.behavior==="wish" 
                      && !this.props.affordable ? 'block' : 'none') }}
                    >X</Button>
          </div>
          <div className="col-6">

            <Autocomplete
              label="Choose an item"
              onChange={(event, newValue) => {
                this.updateItem(newValue)
              }}
              value={this.state.item}
              options={this.props.options}

              renderInput={(params) => <TextField {...params} label="Choose an item" />}
            />

          </div>
          <div className="col-3">
            <TextField type="number" label="Count" variant="outlined" 
              value={this.state.count} onChange={this.updateCount} 
              inputProps={{ step: this.state.buyCount }}  />
          </div>
          <div className="col-2">

            <Button variant="contained"
              style={{ display: (this.props.lastItem>=1 && this.props.id ? 'block' : 'none') }}
              onClick={() => { this.updateInventory(-1) }} >-</Button>

          </div>

        </div>
        <div className="row addRow" style={{ display: (this.props.lastItem>=1 ? 'flex' : 'none') }}>
          <div className="col-1">
            &nbsp;
          </div>
          <div className="col-9">
            <Button variant="contained"
                onClick={() => { this.updateInventory(1) }} >+</Button>
          </div>
          <div className="col-2">
          </div>
        </div>
      </FormControl>;
  }
}

export default InventoryOption;