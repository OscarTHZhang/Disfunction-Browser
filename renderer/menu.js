const {remote, shell} = require('electron')

// menu template
const template = [
    {
        label: 'Items',
        submenu: [
            {
                label: 'Add New',
                click: window.newItem,
                accelerator: 'CmdOrCtrl+O'
            },
            {
                label: 'Read Item',
                accelerator: 'CmdOrCtrl+Enter',
                click: window.openItem 
            }
        ]
    },
    {
        role: 'editMenu'
    },
    {
        role: 'windowMenu'
    }, 
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn more',
                click: () => { shell.openExternal('https://oscarthzhang.github.io/') }
            }
        ]
    }
] 
if (process.platform === 'darwin') {

    template.unshift({
        label: remote.app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services'},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'},
        ]
    })

}

const menu =remote.Menu.buildFromTemplate(template)

// set as main app menu
remote.Menu.setApplicationMenu(menu)
