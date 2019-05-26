import { LightningElement } from 'lwc';
import * as utils from 'c/utils'

export default class CreateAsset extends LightningElement {
    name = "";
    description = "";

    validateAssetDefinition() {
        const assetListElement = this.template.querySelector("c-create-asset-list");
        const propertiesValid = assetListElement.validateProperties();
        const attributesValid = this.validateAttributes();

        // Separate so both are called everytime
        return propertiesValid && attributesValid;
    }

    saveAssetDefinition() {
        console.log("SAVING");
        const formValid = this.validateAssetDefinition();

        if (formValid) {
            let assetList = this.template.querySelector("c-create-asset-list");
            let properties = assetList.getProperties()

            const data = {
                name: this.name,
                description: this.description,
                properties: properties
            }

            utils.api.post(utils.api.URL + "createAssetDefinition", data)
                .then(json => console.log(json))
                .catch(e => {
                    console.error(e)
                });
        } else {
            console.log("Failed Validation");
        }
    }

    validateAttributes() {
        const inputElements = this.template.querySelectorAll("lightning-input");
        const validities = [];
        for (let input of inputElements) {
            let validity = input.reportValidity();
            validities.push(validity)
        }

        // Return true if all attributes returned true
        return validities
            .every(validity => validity === true);
    }

    saveAttribute(e) {
        const name = e.srcElement.name;
        const value = e.srcElement.value;
        this[name] = value.toLowerCase();
    }
}