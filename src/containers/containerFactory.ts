import Docker from 'dockerode';

async function isDockerImageExisted(docker:Docker, imageName:string){

    const images = await docker.listImages();
    const imageExists = images.some((image) => image.RepoTags && image.RepoTags.includes(imageName));
    // Pull the image if it doesn't exist
    if (!imageExists) {
        console.log(`Pulling image ${imageName}...`);
        await new Promise((resolve, reject) => {
            docker.pull(imageName, (err:Error, stream:NodeJS.ReadableStream) => {
                if (err) {
                    return reject(err);
                }
                docker.modem.followProgress(stream, resolve, () => {});
            });
        });
        console.log(`Image ${imageName} pulled successfully.`);
    }

    return;

}

async function createContainer(imageName:string, cmdExecutable:string[]) {

    const docker = new Docker();

    await isDockerImageExisted(docker, imageName);

    // Create the container
    const container = await docker.createContainer({
        Image: imageName,
        Cmd: cmdExecutable,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
        HostConfig: {
            Memory: 1024 * 1024 * 1024, // 1GB
        },
        OpenStdin: true,
    });

    return container;
}

export default createContainer;
