const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;
const firebaseConfig = {
  apiKey: "AIzaSyC1siL2qL5MjLIuODYGgw8E-542QpKntSE",
  authDomain: "webb2566-3e5d1.firebaseapp.com",
  projectId: "webb2566-3e5d1",
  storageBucket: "webb2566-3e5d1.appspot.com",
  messagingSenderId: "457368836369",
  appId: "1:457368836369:web:22380ca86796acd3e394b0",
  measurementId: "G-XFFFR1BR6W"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function StudentTable({ data, app }) {
    return (
        <table className='table'>
            <tr>
                <td>รหัส</td>
                <td>คำนำหน้า</td>
                <td>ชื่อ</td>
                <td>สกุล</td>
                <td>email</td>
            </tr>
            {data.map((s) => (
                <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.title}</td>
                    <td>{s.fname}</td>
                    <td>{s.lname}</td>
                    <td>{s.email}</td>
                    <td><EditButton std={s} app={app} /></td>
                    <td><DeleteButton std={s} app={app} /></td>
                </tr>
            ))}
        </table>
    );
}

function TextInput({ label, app, value, style }) {
    return (
        <label className="form-label">
            {label}:
            <input
                className="form-control"
                style={style}
                value={app.state[value]}
                onChange={(ev) => {
                    var s = {};
                    s[value] = ev.target.value;
                    app.setState(s);
                }}
            />
        </label>
    );
}

function EditButton({ std, app }) {
    return (
        <button onClick={() => app.edit(std)} style={{ backgroundColor: '#6f97d3', color: 'white', borderColor: '#6f97d3' }}>
            แก้ ไข
        </button>
    );
}

function DeleteButton({ std, app }) {
    return (
        <button onClick={() => app.delete(std)} style={{ backgroundColor: '#6f97d3', color: 'white', borderColor: '#6f97d3' }}>
            ลบ
        </button>
    );
}

class App extends React.Component {
    title = (
        <Alert variant="info" style={{ backgroundColor: '#6f97d3', color: 'white', borderColor: '#6f97d3', textAlign: 'center' }}>
            <b>Work6 :</b> เรียกใช้ฐานข้อมูล Firebase ด้วย React
        </Alert>
    );
    footer = (
        <div>
            By 643021429-3 Marisa Pinkaew <br />
            College of Computing, Khon Kaen University
        </div>
    );

    state = {
        scene: 0,
        students: [],
        stdid: "",
        stdtitle: "",
        stdfname: "",
        stdlname: "",
        stdemail: "",
    };

    edit(std) {
        this.setState({
            stdid: std.id,
            stdtitle: std.title,
            stdfname: std.fname,
            stdlname: std.lname,
            stdemail: std.email,
        });
    }

    readData() {
        db.collection("students").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            console.log(stdlist);
            this.setState({ students: stdlist });
        });
    }

    autoRead() {
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    insertData() {
        db.collection("students").doc(this.state.stdid).set({
            title: this.state.stdtitle,
            fname: this.state.stdfname,
            lname: this.state.stdlname,
            email: this.state.stdemail,
        });
    }

    delete(std) {
        if (confirm("ต้องการลบข้อมูล")) {
            db.collection("students").doc(std.id).delete();
        }
    }

    render() {
        return (
            <Card style={{ borderColor: '#e3ecf0' }}>
                <Card.Header style={{ backgroundColor: '#e3ecf0', color: 'white' }}>{this.title}</Card.Header>
                <Card.Body>
                    <Button onClick={() => this.readData()} style={{ backgroundColor: '#6f97d3', color: 'white', borderColor: '#6f97d3' }}>Read Data</Button>{"\u00A0"}
                    <Button onClick={() => this.autoRead()} style={{ backgroundColor: '#6f97d3', color: 'white', borderColor: '#6f97d3' }}>Auto Read</Button>
                    <div>
                        <StudentTable data={this.state.students} app={this} />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br/>
                    <TextInput label="ID" app={this} value="stdid" style={{ width: 120 }} />
                    <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{ width: 100 }} />
                    <TextInput label="ชื่อ" app={this} value="stdfname" style={{ width: 120 }} />
                    <TextInput label="สกุล" app={this} value="stdlname" style={{ width: 120 }} />
                    <TextInput label="Email" app={this} value="stdemail" style={{ width: 150 }} />
                    <Button onClick={() => this.insertData()} style={{ backgroundColor: '#6f97d3', color: 'white', borderColor: '#6f97d3' }}>Save</Button>
                </Card.Footer>
                <Card.Footer style={{ backgroundColor: '#6f97d3', color: 'white', textAlign: 'center' }}>{this.footer}</Card.Footer>
            </Card>
        );
    }
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);