// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  console.log(
    'Congratulations, your extension "create-react-component" is now active!'
  );

  let defaultComp = vscode.commands.registerCommand(
    "create-react-component.default",
    (args) => {
      create(args, "default");
    }
  );

  let styled = vscode.commands.registerCommand(
    "create-react-component.styled",
    (args) => {
      create(args, "styled");
    }
  );

  let styledNative = vscode.commands.registerCommand(
    "create-react-component.styled-native",
    (args) => {
      create(args, "styled-native");
    }
  );

  const create = (args: any, templateName: string) => {
    let incomingpath: string = args._fsPath;

    vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        validateInput: (value) => {
          if (value.indexOf(" ") > -1) {
            return "Component name cannot include spaces";
          }
        },
        prompt: "Please enter component name",
        value: "MyNewComponent",
      })
      .then((componentName) => {
        if (typeof componentName === "undefined") {
          return;
        }

        var componentFolderPath = incomingpath + path.sep + componentName;

        console.log("new file path", componentFolderPath);
        if (fs.existsSync(componentFolderPath)) {
          vscode.window.showErrorMessage("Component folder already exists");
          return;
        }

        fs.mkdirSync(componentFolderPath);
        const componentPath =
          componentFolderPath + path.sep + componentName + ".tsx";

        const extension = vscode.extensions.getExtension(
          "chrispaynter.create-react-component"
        );

        vscode.workspace
          .openTextDocument(
            extension!.extensionPath + "/templates/" + templateName + ".tmpl"
          )
          .then((doc: vscode.TextDocument) => {
            fs.writeFileSync(componentPath, doc.getText());
          });

        const indexPath = componentFolderPath + path.sep + "index.ts";
        vscode.workspace
          .openTextDocument(
            extension!.extensionPath + "/templates/" + "index.tmpl"
          )
          .then((doc: vscode.TextDocument) => {
            let text = doc.getText();
            text = text.replace("${componentName}", componentName);
            text = text.replace("${componentName}", componentName);
            fs.writeFileSync(indexPath, text);
          });

        vscode.window.showInformationMessage("Created component");
      });
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand(
  //   "create-react-component.helloWorld",
  //   () => {
  //     // The code you place here will be executed every time your command is executed

  //     // Display a message box to the user
  //     vscode.window.showInformationMessage(
  //       "Hello World from create-react-component!"
  //     );

  //     const folders = vscode.workspace.workspaceFolders;

  //     console.log("folders", folders);

  //     // vscode.workspace.updateWorkspaceFolders(0, undefined, {

  //     // })
  //   }
  // );

  context.subscriptions.push(defaultComp);
  context.subscriptions.push(styled);
  context.subscriptions.push(styledNative);
}

// this method is called when your extension is deactivated
export function deactivate() {}
