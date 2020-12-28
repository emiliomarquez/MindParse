import React, {Component, useState} from 'react';
import axios from 'axios';
export default class Quote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quote: '',
            author: ''
        }
    }

    componentDidMount() {
        this.getQuote()
    }

    getQuote() {
        let url = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json'

        axios.get(url)
            .then(res => {
                let data = res.data.quotes
                let quoteNum = Math.floor(Math.random() * data.length)
                let randomQuote = data[quoteNum]
                // let randomQuote = data[Math.floor(Math.random() * data.length)]

                this.setState({
                    quote: randomQuote['quote'],
                    author: randomQuote['author']
                })
            })
    }

    getNewQuote = () => {
        this.getQuote()
    }

    render() {
        const { quote, author } = this.state
        return (


                <div id='quote-container'>
                    <div id='text'><h2>"{quote}"</h2></div>
                    <br/>
                    <div id='author'><h5>-{author}</h5></div>
                    <br/>
                    <div id='buttons'>
                        <button className='button' id='new-quote' onClick={this.getNewQuote} > New Quote </button>
                    </div>
                </div>
        )
    }
}

