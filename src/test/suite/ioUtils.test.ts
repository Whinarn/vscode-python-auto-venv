import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as ioUtils from '../../ioUtils';

chai.should();
chai.use(chaiAsPromised);

suite('IO Utils Test Suite', () => {
    test('file stat for existing file', () => {
        return ioUtils.fileStat(__filename).should.eventually.be.an('object');
    });

    test('file stat for not existing file', () => {
        return ioUtils.fileStat(__dirname + '.doesntexist').should.eventually.be.undefined;
    });

    test('directory should exist', () => {
        return ioUtils.dirExists(__dirname).should.eventually.equal(true);
    });

    test('directory should not exist', () => {
        return ioUtils.dirExists(__dirname + '.doesntexist').should.eventually.equal(false);
    });

    test('file should exist', () => {
        return ioUtils.fileExists(__filename).should.eventually.equal(true);
    });

    test('file should not exist', () => {
        return ioUtils.fileExists(__filename + '.doesntexist').should.eventually.equal(false);
    });
});
