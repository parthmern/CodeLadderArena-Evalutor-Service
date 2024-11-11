import CppExecutor from "../containers/runCpp";
import JavaExecutor from "../containers/runJavaDocker";
import PythonExecutor from "../containers/runPythonDocker";
import CodeExecutorStrategy from "../types/CodeExecutorStrategy";

export default function createExecutor(codeLanguage: string) : CodeExecutorStrategy | null {
    // console.log("codeLanguage?.toLowerCase()=>", codeLanguage);
    if(codeLanguage?.toLowerCase() == "python") {
        return new PythonExecutor();
    } else if (codeLanguage?.toLowerCase() == "java"){
        return new JavaExecutor();
    } else if(codeLanguage?.toLowerCase() == "cpp"){
        return new CppExecutor();
    }
    else {
        console.log("codeLanguage?.toLowerCase() not detected");
        return null;
    }
}