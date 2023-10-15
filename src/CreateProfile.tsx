import { useForm } from "react-hook-form";

function CreateProfile() {
    const {
        register,
        handleSubmit
    } = useForm();

    const onSubmit = (data: any) => {
        /*
        // Connection string for Azurite
        const connectionStr = 'AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;';
        
        // Create a BlobServiceClient using the connection string
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionStr);

        // You can now interact with the Azurite Blob service. For example, list containers:
        async function listContainers() {
            const containersIterator = blobServiceClient.getContainerClient('$root').listContainers();

            for await (const container of containersIterator) {
                console.log(`Container name: ${container.name}`);
            }
        }

        // Call the function to list containers
        listContainers()
            .then(() => console.log('Containers listed successfully'))
            .catch((error) => console.error('Error listing containers', error));
            */
        console.log(data);
    };

    return (
        <div className="CreateProfile">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Name:
                    <input {...register("Name") }></input>
                </label>
                <label>
                    Interest:
                    <input {...register("Interest")}></input>
                </label>
                <div className="form-control">
                    <label></label>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}

export default CreateProfile;