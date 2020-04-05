import * as chai from 'chai';
import { testWithPlatform } from './utils';
import * as commandUtils from '../../commandUtils';

chai.should();

suite('Command Utils Test Suite (Windows)', function() {
    testWithPlatform('should create command without escaping', 'win32', function() {
        commandUtils.getCommand('pip', 'install', '-r', 'requirements.txt').should.be.equal('pip install -r requirements.txt');
    });

    testWithPlatform('should create command with escaping', 'win32', function() {
        commandUtils.getCommand('pip', 'install', '-r', 'C:\Folder\With Spaces\requirements.txt').should.be.equal('pip install -r "C:\Folder\With Spaces\requirements.txt"');
    });

    testWithPlatform('should not escape path', 'win32', function() {
        commandUtils.escapePath('C:\Folder\WithoutSpaces\File.txt').should.be.equal('C:\Folder\WithoutSpaces\File.txt');
    });

    testWithPlatform('should escape path', 'win32', function() {
        commandUtils.escapePath('C:\Folder\With Spaces\File.txt').should.be.equal('"C:\Folder\With Spaces\File.txt"');
    });

    testWithPlatform('should not escape argument', 'win32', function() {
        commandUtils.escapeArgument('-thisDoesntNeed=escaping').should.be.equal('-thisDoesntNeed=escaping');
    });

    testWithPlatform('should escape argument', 'win32', function() {
        commandUtils.escapeArgument('this needs escaping and that\'s okay').should.be.equal('"this needs escaping and that\'s okay"');
    });
});
