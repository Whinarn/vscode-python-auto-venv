import * as chai from 'chai';
import { testWithPlatform } from './utils';
import * as commandUtils from '../../commandUtils';

chai.should();

suite('Command Utils Test Suite (Unix)', function() {
    testWithPlatform('should create command without escaping', 'linux', function() {
        commandUtils.getCommand('pip', 'install', '-r', 'requirements.txt').should.be.equal('pip install -r requirements.txt');
    });

    testWithPlatform('should create command with escaping', 'linux', function() {
        commandUtils.getCommand('pip', 'install', '-r', '/folder/with spaces/requirements.txt').should.be.equal('pip install -r \'/folder/with spaces/requirements.txt\'');
    });

    testWithPlatform('should not escape path', 'linux', function() {
        commandUtils.escapePath('/folder/withoutspaces/file.txt').should.be.equal('/folder/withoutspaces/file.txt');
    });

    testWithPlatform('should escape path', 'linux', function() {
        commandUtils.escapePath('/folder/with spaces/file.txt').should.be.equal('/folder/with\\ spaces/file.txt');
    });

    testWithPlatform('should not escape argument', 'linux', function() {
        commandUtils.escapeArgument('-thisDoesntNeed=escaping').should.be.equal('-thisDoesntNeed=escaping');
    });

    testWithPlatform('should escape argument', 'linux', function() {
        commandUtils.escapeArgument('this needs escaping and that\'s okay').should.be.equal('\'this needs escaping and that\\\'s okay\'');
    });
});
