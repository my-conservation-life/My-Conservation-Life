import { LightningElement, track } from 'lwc';
import { assetDefinitions } from 'c/controllers';

export default class ExportCSV extends LightningElement {

    @track value = 'Select an asset type...';
    @track valueID = null;
    @track placeholder = "N/A";
    @track typeOptions;
    @track typeIdOptions;
    @track descriptionOptions;
    @track propertiesOptions;
    @track combo_options = [];
    @track CSV_data = [];

    connectedCallback() {
        var i;
        assetDefinitions.findAssetTypes()
            .then(data => {
                var temp_options = [];
                for (i = 0; i < data.rows.length; i++) {
                    temp_options.push({
                        'label': data.rows[i]["name"] + ": " + data.rows[i]["id"],
                        'value': data.rows[i]["name"] + ": " + data.rows[i]["id"]
                    });
                }
                this.combo_options = temp_options;
            })
            .catch(e => {
                console.log("Exception: ", e.stack());
            });
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.valueID = event.detail.value.split(':')[1].trimLeft();
    }

    downloadTest() {        
        var i, j;
        var csv_data = '';
        var rows = [];
        assetDefinitions.fetchAssetPropTypes(this.valueID)
            .then(data => {
                rows = [this.valueID];
                for (i = 0; i < data.rows.length; i++) {
                    rows.push(data.rows[i]['name']);
                }
                csv_data += rows.join(',') + '\n';
                assetDefinitions.fetchAssetsByTypeID(this.valueID)
                    .then(data => {
                        rows = [];
                        for (i = 0; i < data.rows.length; i++) {
                            rows.push(this.valueID);
                            rows.push(data.rows[i]['id']);
                            assetDefinitions.fetchAssetProperties(data.rows[i]['id'])
                                .then(props => {
                                    for (j = 0; j < props.rows.length; j++) {
                                        rows.push(props.rows[i]);
                                    }
                                    csv_data += rows.join(',') + '\n';
                                    rows = [];
                                })
                                .catch(e => {
                                    console.log('sdfwf', e);
                                });
                        }
                        /////////////
                        var hiddenElement = document.createElement('a');
                        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv_data);
                        hiddenElement.target = '_blank';
                        hiddenElement.download = this.value + '.csv';
                        hiddenElement.click();
                        ///////////////////////
                        // console.log("props: " + JSON.stringify(temp_data));
                    })
                    .catch(e => {
                        console.log("props exception: ", e);
                    });
            })
            .catch(e => {
                console.log('Exception: ', e);
            });
        
    }
}
