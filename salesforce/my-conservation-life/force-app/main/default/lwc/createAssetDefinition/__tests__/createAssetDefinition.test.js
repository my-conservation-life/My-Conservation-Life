import { createElement } from 'lwc';
import createAssetDefinition from 'c/createAssetDefinition';

describe.skip('c-create-asset-definition', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    test('new test', () => {
        throw new Error('test needs implementing');
    });
});