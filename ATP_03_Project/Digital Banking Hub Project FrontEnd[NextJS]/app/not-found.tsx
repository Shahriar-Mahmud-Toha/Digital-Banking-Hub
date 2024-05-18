
export default function NotFound() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ marginTop: '1rem' }}>
                <img src="https://th.bing.com/th/id/OIP.ZPbkU6Ne9bOLqS1RUqa8YQHaFj?rs=1&pid=ImgDetMain" alt="Page Not Found" width={300} height={300} />
            </div>
            <h2 style={{ fontSize: '2rem', color: 'red' }}>Page Not Found</h2>
        </div>
    );
}
