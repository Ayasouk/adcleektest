
export async function GET(
    req
) {
    try {
        const idcity = req.params.id;

        const data = await axios.get("https://candidat.adcleek.it/cities")

        return NextResponse.json(data.data);
    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500});
    }
}