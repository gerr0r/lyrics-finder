const HelpText = ({ input }) => {
    return (
        <p>
            Multiple {input}s can be added.<br />
            Every line represents one {input}.<br />
            Press enter to go on new line. <br />
            Existing {input}s will be ignored.
        </p>
    )
}

export default HelpText
