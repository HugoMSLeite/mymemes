import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { Wrapper, Card, Templates, Form, Button } from './styles';
import logo from '../../images/logo.svg';


export default function Home() {
    const [templates, setTemplate] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [boxes, setBoxes] = useState([]);
    const [generatedMeme, setGeneratedMeme] = useState(null);

    useEffect(() => {
        (async () => {
            const resp = await fetch('https://api.imgflip.com/get_memes');
            const { data: { memes } } = await resp.json();
            setTemplate(memes);
        })();
    }, []);

    const handleInputChange = (index) => (e) => {
        const newValues = boxes;
        newValues[index] = e.target.value;
        setBoxes(newValues);
    }

    function handleSelectTamplate(template) {
        setSelectedTemplate(template);
        setBoxes([]);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const params = qs.stringify({
            template_id: selectedTemplate.id,
            username: 'HugoLeite',
            password: 'testePass',
            boxes: boxes.map(text => ({ text })),
        });

        const resp = await fetch(`https://api.imgflip.com/caption_image?${params}`);
        const { data: { url } } = await resp.json();
        setGeneratedMeme(url);
    }

    function handleReset() {
        setSelectedTemplate(null);
        setBoxes([]);
        setGeneratedMeme(null);
    }

    return (<Wrapper>
        <h1>My memes</h1>
        <Card>
            {generatedMeme && (
                <>
                    <img src={generatedMeme} alt="" />
                    <Button type="button" onClick={() => handleReset()}>Enviar outro meme</Button>
                </>
            )}
            {!generatedMeme && (
                <>
                    <h2>Selecione um template</h2>
                    <Templates>
                        {templates.map(template => (
                            <button key={template.id}
                                type="button"
                                onClick={() => handleSelectTamplate(template)}
                                className={template.id === selectedTemplate?.id ? 'selected' : ''}>
                                <img src={template.url} alt={template.name} />
                            </button>
                        ))}
                    </Templates>
                    {selectedTemplate && (
                        <>
                            <h2>Textos</h2>
                            <Form onSubmit={handleSubmit}>
                                {(new Array(selectedTemplate.box_count)).fill('').map((_, index) => (
                                    <input key={String(Math.random())}
                                        placeholder={`Texto #${index + 1}`}
                                        onChange={handleInputChange(index)}
                                    />
                                ))}

                                <Button type="submit">Make my meme</Button>
                            </Form>
                        </>
                    )}
                </>
            )}
        </Card>
    </Wrapper>
    )
}