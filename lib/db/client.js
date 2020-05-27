/**
 * Sqlite: https://github.com/mapbox/node-sqlite3
 */
class SQLite {
    constructor() {
        try {
            this.client = require('sqlite3');
        }
        catch (err) {
            throw new Error('Cannot find `sqlite3` module');
        }
        this.connection = null;
        this.config = null;
        this.sqlite = true;
        this.name = 'sqlite';
    }

    connect(dbname) {
        this.connection = new this.client.Database(dbname);
        this.config = { schema: '' };
    }

    query(sql, done) {
        if (/^(insert|update|delete)/i.test(sql)) {
            this.connection.run(sql, function (err) {
                if (err)
                    return done(err);
                done(null, { insertId: this.lastID });
            });
        }
        else {
            this.connection.all(sql, function (err, rows) {
                if (err)
                    return done(err);
                done(null, rows);
            });
        }
    }

    close() {
        this.connection.close();
    }
}

function Client() {
    return new SQLite();
}

exports = module.exports = Client;
