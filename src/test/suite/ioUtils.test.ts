import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as path from 'path';
import * as ioUtils from '../../ioUtils';

chai.should();
chai.use(chaiAsPromised);

suite('IO Utils Test Suite', function() {
    test('file stat for existing file', function() {
        return ioUtils.fileStat(__filename).should.eventually.be.an('object');
    });

    test('file stat for not existing file', function() {
        return ioUtils.fileStat(__dirname + '.doesntexist').should.eventually.be.undefined;
    });

    test('directory should exist', function() {
        return ioUtils.dirExists(__dirname).should.eventually.equal(true);
    });

    test('directory should not exist', function() {
        return ioUtils.dirExists(__dirname + '.doesntexist').should.eventually.equal(false);
    });

    test('file should exist', function() {
        return ioUtils.fileExists(__filename).should.eventually.equal(true);
    });

    test('file should not exist', function() {
        return ioUtils.fileExists(__filename + '.doesntexist').should.eventually.equal(false);
    });

    test('path should have trailing directory separator removed', function() {
        const dirPath = path.join('test', 'path');
        return ioUtils.removeTrailingDirectorySeparator(dirPath + path.sep).should.equal(dirPath);
    });

    test('path without trailing directory separator should stay the same', function() {
        const dirPath = path.join('test', 'path');
        return ioUtils.removeTrailingDirectorySeparator(dirPath).should.equal(dirPath);
    });

    test('path should have trailing directory separator added', function() {
        const dirPath = path.join('test', 'path');
        return ioUtils.addTrailingDirectorySeparator(dirPath).should.equal(dirPath + path.sep);
    });

    test('path with trailing directory separator should stay the same', function() {
        const dirPath = path.join('test', 'path') + path.sep;
        return ioUtils.addTrailingDirectorySeparator(dirPath).should.equal(dirPath);
    });
});
