import { equal } from "assert";
import { expect } from "chai";
import { postBin, deleteBin, putBin, getBin } from "../../apiClient";
import { collections, environment, headerCreateBin, binBodies, errorMessages, binIds, headerUpdateBin } from "../../veriables";



const secretKey = environment.secretKey;
const headerDelete = { "secret-key": secretKey }
let collectionId = collections.testColletction1.id
let postBinBody = binBodies.testBin1Layer;
let putBinBody1 = binBodies.testBin2Layer;
let putBinBody2 = binBodies.testBin3Layer;


describe('Bins /b', () => {
    before(async () => {

    });
    describe('POST', () => {
        it('200 and created bin details. Private by default.', async () => {
            const header = headerCreateBin(secretKey, collectionId, 'Private by default.');
            let res = await postBin(header, postBinBody);
            let body = res.body;

            //Clean up new created bin
            await deleteBin(headerDelete, body.id);

            //Validate response data
            expect(res.status).equal(200);
            expect(body.success).equal(true);
            expect(body.data).deep.equal(postBinBody);
            expect(body.id).to.be.string;
            expect(body.collectionID).equal(collections.testColletction1.id);
            expect(body.private).equal(true);
            expect(body.binName).equal(header.name);
        });
        it('200 and created bin details. Public.', async () => {
            //Create new bin
            const header = headerCreateBin(secretKey, collectionId, 'Public by default.', false);
            let res = await postBin(header, postBinBody);
            let body = res.body;

            //Clean up new created bin
            await deleteBin(headerDelete, body.id);

            //Validate response data
            expect(res.status).equal(200);
            expect(body.success).equal(true);
            expect(body.data).deep.equal(postBinBody);
            expect(body.id).to.be.string;
            expect(body.collectionID).equal(collections.testColletction1.id);
            expect(body.private).equal(false);
            expect(body.binName).equal(header.name);
        });
        it('200 for name with 128 characters and Private explicitly', async () => {
            const header = headerCreateBin(secretKey, collectionId, "128characters and Private explicitly..=-0976543></e?~'}{POIUYTREWQ:LKJHGFDSA?><MNBVCXertZ`@#$%][piuiyizxcvbnm,~", false);
            let res = await postBin(header, postBinBody);
            let body = res.body;

            //Clean up new created bin
            await deleteBin(headerDelete, body.id);

            //Validate response data
            expect(res.status).equal(200);
            expect(body.success).equal(true);
            expect(body.data).deep.equal(postBinBody);
            expect(body.id).to.be.string;
            expect(body.collectionID).equal(collections.testColletction1.id);
            expect(body.private).equal(false);
            expect(body.binName).equal(header.name);
        });
        it('401 for unauthorized call', async () => {
            //Attempt to create new bin
            const header = headerCreateBin(null, collectionId);
            let res = await postBin(header, postBinBody);
            let body = res.body;
            //Validate response
            expect(res.status).equal(401);
            expect(body.success).equal(false);
            expect(body.message).equal(errorMessages.bins["401 Unauthorized"]);
        });
        it('422 Unprocessible Entity. Expected content type - application/json', async () => {

        });
        it('422 Unprocessible. Entity JSON cannot be empty', () => {

        });
        it('422 Unprocessible. Entity Invalid Collection ID', () => {

        });
        it('401 Unauthorized. Invalid secret key provided.', () => {

        });
        it('422 Unprocessible Entity. Bin Name cannot be longer than 128 characters.', () => {

        });
        it('422 Unprocessible Entity. Bin Name cannot be empty.', () => {

        });
    });
    describe('GET', () => {
        const headerCreate = headerCreateBin(secretKey, collectionId, 'Get bin.', false);
        let newBin;

        before(async () => {
            let res = await postBin(headerCreate, postBinBody);
            newBin = res.body;
        });

        after(async () => {
            await deleteBin(headerDelete, newBin.id);
        });

        it('200 and bin details', async () => {
            let res = await getBin(headerDelete, newBin.id);
            let body = res.body

            expect(res.status).equal(200);
            expect(body).deep.equal(postBinBody);

        });
        it('200 and details for desired bin version', () => {

        });
        it('200 and details for last bin version', () => {

        });
        it('422 Unprocessible Entity. Invalid Bin ID', async () => {
            let res = await getBin(headerDelete, binIds.invlidBinId);
            let body = res.body;

            expect(res.status).equal(422);
            expect(body.message).equal(errorMessages.bins["422 Unprocessible Entity. Invalid Id "]);

        });
        it('401 Unauthorized. Need to provide a secret-key to READ private bins', () => {

        });
        it('401 Unauthorized. Invalid secret key provided.', () => {

        });
        it('404 Not Found. Bin not found', async () => {
            let res = await getBin(headerDelete, binIds.notExistingBinId);
            let body = res.body;

            expect(res.status).equal(404);
            expect(body.message).equal(errorMessages.bins["404 Not Found"]);
            expect(body.success).equal(false);
        });

    });
    describe('PUT', () => {
        const headerCreatePrivate = headerCreateBin(secretKey, collectionId, 'PUT Private bin.');
        const headerCreatePublic = headerCreateBin(secretKey, collectionId, 'PUT Public bin.', false);
        let newPrivateBin;
        let newPublicBin;

        before(async () => {
            let resPrivate = await postBin(headerCreatePrivate, postBinBody);
            let resPublic = await postBin(headerCreatePublic, postBinBody);
            newPrivateBin = resPrivate.body;
            newPublicBin = resPublic.body
        });

        after(async () => {
            await deleteBin(headerDelete, newPublicBin.id);
            await deleteBin(headerDelete, newPrivateBin.id);
        });

        it('200 Bin updated and versioning is enabled for Private bins', async () => {
            const header = headerUpdateBin(secretKey, true);
            let resUpdate1 = await putBin(header, newPrivateBin.id, putBinBody1);
            let resUpdate2 = await putBin(header, newPrivateBin.id, putBinBody2);
            let resBody1 = resUpdate1.body;
            let resBody2 = resUpdate2.body;

            expect(resUpdate1.status).equal(200);
            expect(resBody1.success).equal(true);
            expect(resBody1.version).equal(1);
            expect(resBody1.data).deep.equal(putBinBody1);
            expect(resBody1.parentId).equal(newPrivateBin.id);
            expect(resUpdate2.status).equal(200);
            expect(resBody2.success).equal(true);
            expect(resBody2.version).equal(2);
            expect(resBody2.data).deep.equal(putBinBody2);
            expect(resBody2.parentId).equal(newPrivateBin.id);
        }).timeout(4000);

        it('200 bin updated and versioning is disabled for Private bins', () => {

        });
        it('200 bin updated and versioning is applied to Public', () => {

        });
        it('200 bin updated and versioning cant be disabled for Public', () => {

        });
        it('422 Unprocessible Entity. Expected content type - application/json', () => {
            
        });
        it('422 Unprocessible Entity. JSON cannot be empty', () => {
            
        });
        it('422 Unprocessible Entity. Invalid Bin ID', () => {
            
        });
        it('404 Not Found	Bin not found', () => {
            
        });
        it('401 Unauthorized	Need to provide a secret-key to UPDATE private bins', () => {
            
        });
        it('401 Unauthorized	Invalid secret key provided', () => {
            
        });

    });
    describe('DELETE', () => {
        before(() => {
            //create bin for negative scenarios
        });
        after(() => {
            //delete bin for negative scenarios
        });
        it('200 and bin is deleted', async () => {
            const header = headerCreateBin(secretKey, collectionId, 'Private by default.');
            let resCreate = await postBin(header, postBinBody);
            let bodyCreate = resCreate.body;
            let resDelete = await deleteBin(headerDelete, resCreate.body.id);
            let body = resDelete.body;
            let resGet = await getBin (headerDelete, bodyCreate.id);
            // ertert

            expect(resDelete.status).equal(200);
            expect(body.success).equal(true)
            expect(body.id).equal(resCreate.body.id);
            expect(body.message).equal('Bin ' + bodyCreate.id + ' is deleted successfully. 0 versions removed.');
            expect(resGet.status).equal(404);
        });
        it('422 Unprocessible Entity. Expected content type - application/json', () => {
            
        });
        it('422 Unprocessible Entity. JSON cannot be empty', () => {
            
        });
        it('422 Unprocessible Entity. Invalid Bin ID', () => {
            
        });
        it('404 Not Found. Bin not found', () => {
            
        });
        it('401 Unauthorized. Need to provide a secret-key to UPDATE private bins', () => {
            
        });
        it('401 Unauthorized. Invalid secret key provided', () => {
            
        });

    });
});