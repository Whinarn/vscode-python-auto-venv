import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fileUtils from '../../fileUtils';

chai.should();
chai.use(chaiAsPromised);

suite('File Utils Test Suite', () => {
    test('file should exist', () => {
        return fileUtils.fileExists(__filename).should.eventually.equal(true);
    });

    test('file should not exist', () => {
        return fileUtils.fileExists(__filename + '.doesntexist').should.eventually.equal(false);
    });
});
