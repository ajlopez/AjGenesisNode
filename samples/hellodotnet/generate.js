
var ajgenesis = require('../../lib/ajgenesis.js'),
	fs = require('fs'),
	path = require('path');

// Loading the project definition

var	project = require('./project.json');

// Completing the project

if (!project.title)
	project.title = project.name;
	
if (!project.buildDirectory)
	project.buildDirectory = './build';

if (!project.guidVb)
	project.guidVb = ajgenesis.createUuid();
if (!project.guidVbCom)
	project.guidVbCom = ajgenesis.createUuid();

if (!project.guidCs)
	project.guidCs = ajgenesis.createUuid();
if (!project.guidCsCom)
	project.guidCsCom = ajgenesis.createUuid();

// Creating the directories

ajgenesis.createDirectory(project.buildDirectory);
ajgenesis.createDirectory(project.buildDirectory, project.name);
ajgenesis.createDirectory(project.buildDirectory, project.name, project.name + "Vb");
ajgenesis.createDirectory(project.buildDirectory, project.name, project.name + "Vb", "My Project");
ajgenesis.createDirectory(project.buildDirectory, project.name, project.name + "Cs");
ajgenesis.createDirectory(project.buildDirectory, project.name, project.name + "Cs", "Properties");
	
// Model to use

var model = {
	project: project
}

// Create Solution File

ajgenesis.fileTransform(path.join(__dirname, 'templates/Solution.tpl'), path.join(project.buildDirectory, project.name, project.name + ".sln"), model);

// Create VB.Net Project

ajgenesis.fileTransform(path.join(__dirname, 'templates/ModuleVb.tpl'), path.join(project.buildDirectory, project.name, project.name + "Vb", 'Module1.vb'), model);
ajgenesis.fileTransform(path.join(__dirname, 'templates/AssemblyInfoVb.tpl'), path.join(project.buildDirectory, project.name, project.name + "Vb", 'My Project', 'AssemblyInfo.vb'), model);
ajgenesis.fileTransform(path.join(__dirname, 'templates/VbProject.tpl'), path.join(project.buildDirectory, project.name, project.name + "Vb", project.name + 'Vb.vbproj'), model);

// Create C# Project

ajgenesis.fileTransform(path.join(__dirname, 'templates/ClassCs.tpl'), path.join(project.buildDirectory, project.name, project.name + "Cs", 'Program.cs'), model);
ajgenesis.fileTransform(path.join(__dirname, 'templates/AssemblyInfoCs.tpl'), path.join(project.buildDirectory, project.name, project.name + "Cs", 'Properties', 'AssemblyInfo.cs'), model);
ajgenesis.fileTransform(path.join(__dirname, 'templates/CsProject.tpl'), path.join(project.buildDirectory, project.name, project.name + "Cs", project.name + 'Cs.csproj'), model);

